import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as NGL from 'ngl';
import OverlyComponent from './OverlyComponent';
import { addOverlay, removeOverlay, changeColor, setProteanArray } from '../Stores/Reducers/OverlayReducer';
import uuid from 'react-uuid';


class ProteinVisualizerComponent extends Component {
  static propTypes = {
    proteinSequences: PropTypes.arrayOf(PropTypes.string).isRequired,
    shoudlDisplaySuperImposed: PropTypes.bool.isRequired,
    addOverlay: PropTypes.func.isRequired,
    removeOverlay: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    overlays: PropTypes.object.isRequired,
    usAlignment: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.stage = null; // Store the NGL.Stage instance here
    this.proteanArray = [];
    this.proteanStructureInfoArray = []; // Stores Seralizable info about the proteins
    this.overlayID = uuid();
    this.props.addOverlay({ id: this.overlayID, color: "red" });
    this.getProteanReprisentations = this.getProteanReprisentations.bind(this);
    this.AddProteanToArray = this.AddProteanToArray.bind(this);
    this.AddProteanInfoToInfoArray = this.AddProteanInfoToInfoArray.bind(this);
    this.removeRepresentationFromProtean = this.removeRepresentationFromProtean.bind(this);
    this.addRepresentationToProtean = this.addRepresentationToProtean.bind(this);
  }

  componentDidMount() {
    this.stage = new NGL.Stage(this.container.current);
    // need to refract this code
    const loadProteins = async () => {
      for (let i = 0; i < this.props.proteinSequences.length; i++) {
        try {
          if (this.props.shoudlDisplaySuperImposed) {
            await this.AddProteanToArray(this.props.proteinSequences[i], true);
            await this.AddProteanToArray(this.props.proteinSequences[++i]);
          }
          else {
            await this.AddProteanToArray(this.props.proteinSequences[i]);
          }
        }
        catch (error) {
          console.log(error);
        }
      }

      this.props.setProteanArray({ id: this.overlayID, proteanInfoArray: this.proteanStructureInfoArray });
      this.stage.autoView();
      this.stage.viewer.requestRender();
    }
    loadProteins();
  }

  async AddProteanToArray(protean, shouldLoadAsBlob = false) {
    try {
      if (shouldLoadAsBlob) {
        const res = await this.stage.loadFile(new Blob([protean], { type: 'text/plain' }), { ext: 'pdb', defaultRepresentation: true });
        this.proteanArray.push(res);
        this.AddProteanInfoToInfoArray(res, true);
      }
      else {
        const res = await this.stage.loadFile(protean, { defaultRepresentation: true });
        this.proteanArray.push(res);
        this.AddProteanInfoToInfoArray(res);
      }
    } catch (error) {
      console.log(error);
    }
  }

  AddProteanInfoToInfoArray(protean, sameNameId = false) {
    const proteanStructureInfo = {
      // if should be the custome name if it's not nulls else it should be the id
      id: protean.structure.id,
      name: sameNameId ? protean.structure.id : protean.structure.name.replace(/\.pdb(\.[^.]+)?$/g, ''),
      path: protean.structure.path,
      atomCount: protean.structure.atomCount,
      sequence: protean.structure.getSequence().join(""),
    };
    this.proteanStructureInfoArray.push(proteanStructureInfo);
  }


  getProteanReprisentations(proteanName) {
    let reps = [];
    const protean = this.proteanArray.find((protean) => proteanName === protean.structure.id);
    reps = protean.reprList;
    return reps;
  }

  addRepresentationToProtean(proteanName, reprisentationType) {
    const protean = this.proteanArray.find((protean) => proteanName === protean.structure.id);
    protean.addRepresentation(reprisentationType.type, reprisentationType.parms);
    this.stage.autoView();
    this.stage.viewer.requestRender();
  }

  removeRepresentationFromProtean(proteanName, reprisentationType) {
    const protean = this.proteanArray.find((protean) => proteanName === protean.structure.id);
    protean.removeRepresentation(reprisentationType);
    this.stage.autoView();
    this.stage.viewer.requestRender();
  }
  
  componentDidUpdate(prevProps) {
    this.stage.handleResize();
    this.proteanArray.forEach((protean) => {
      //protean.addRepresentation('cartoon', { color: this.props.overlays[this.overlayID].color });
    });
    this.stage.autoView();
    this.stage.viewer.requestRender();
  }
  render() {
    return (
      <div className='visualizer-container '>
        <div ref={this.container} className="ngl-container" >
          <OverlyComponent
            changeColor={this.props.changeColor}
            overlayID={this.overlayID}
            proteanArray={this?.proteanStructureInfoArray || []}
            getProteanRepresentation={this.getProteanReprisentations}
            removeProteanRepresentation={this.removeRepresentationFromProtean}  
            addRepresentationToProtean={this.addRepresentationToProtean}
            usAlignment={this.props.usAlignment}
          />
        </div>
      </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => {
  const access = state.overlays.overlays;
  return {
    overlays: access,
  };
};


const mapDispatchToProps = {
  addOverlay,
  removeOverlay,
  changeColor,
  setProteanArray,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVisualizerComponent);



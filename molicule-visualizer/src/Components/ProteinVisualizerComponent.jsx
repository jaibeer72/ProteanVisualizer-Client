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
  }

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.stage = null; // Store the NGL.Stage instance here
    this.proteanArray = [];
    this.proteanStructureInfoArray = []; // Stores Seralizable info about the proteins
    this.overlayID = uuid();
    this.props.addOverlay({ id: this.overlayID, color: "red" });
    this.changeRepriestntation = this.changeRepriestntation.bind(this);
    this.getProteanReprisentations = this.getProteanReprisentations.bind(this);
  }

  componentDidMount() {
    this.stage = new NGL.Stage(this.container.current);
    // need to refract this code
    const loadProteins = async () => {
      for (let i = 0; i < this.props.proteinSequences.length; i++) {
        let proteanStructureInfo = {};
        try {
          if (this.props.shoudlDisplaySuperImposed) {
            this.proteanArray.push(await this.stage.loadFile(new Blob([this.props.proteinSequences[i]], { type: 'text/plain' }), { ext: 'pdb', defaultRepresentation: true }));
            this.proteanArray.push(await this.stage.loadFile(this.props.proteinSequences[i + 1], { defaultRepresentation: true }));
          }
          else {
            this.proteanArray.push(await this.stage.loadFile(this.props.proteinSequences[i], { defaultRepresentation: true }));
          }

          proteanStructureInfo = {
            id: this.proteanArray[i].id,
            name: this.proteanArray[i].structure.name.replace(/\.pdb(\.[^.]+)?$/g, ''),
            path: this.proteanArray[i].structure.path,
            atomCount: this.proteanArray[i].structure.atomCount,
            sequence: this.proteanArray[i].structure.getSequence().join(""),
          };
          this.proteanStructureInfoArray.push(proteanStructureInfo);
          if (this.props.shoudlDisplaySuperImposed) {
            i++;
            proteanStructureInfo = {
              id: this.proteanArray[i].id,
              name: this.proteanArray[i].structure.name.replace(/\.pdb(\.[^.]+)?$/g, ''),
              path: this.proteanArray[i].structure.path,
              atomCount: this.proteanArray[i].structure.atomCount,
              sequence: this.proteanArray[i].structure.getSequence().join(""),
            };
            this.proteanStructureInfoArray.push(proteanStructureInfo);
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


  /// Change the representation of a protean
  changeRepriestntation(proteanName, reprisentationType) {
    const protean = this.proteanArray.find((protean) => proteanName === protean.id);
    protean.removeAllRepresentations();
    protean.addRepresentation(reprisentationType);
    this.stage.autoView();
    this.stage.viewer.requestRender();
  }

  getProteanReprisentations(proteanName) {
    const protean = this.proteanArray.find((protean) => proteanName === protean.structure.id);
    this.stage.autoView();
    return protean.reprList;
  }

  componentDidUpdate(prevProps) {
    this.stage.handleResize();
    this.proteanArray.forEach((protean) => {
      protean.addRepresentation('cartoon', { color: this.props.overlays[this.overlayID].color });
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
            setProteanRepresentation={this.changeRepriestntation}
            getProteanRepresentation={this.getProteanReprisentations}
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



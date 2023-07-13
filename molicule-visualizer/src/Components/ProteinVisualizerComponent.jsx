import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as NGL from 'ngl';
import OverlyComponent from './OverlyComponent';
import { addOverlay , removeOverlay , changeColor, setProteanArray} from '../Stores/Reducers/OverlayReducer';
import uuid from 'react-uuid';
import FeatureViewer from 'feature-viewer';


class ProteinVisualizerComponent extends Component {
  static propTypes = {
    proteinPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    this.overlayID = uuid();
    this.props.addOverlay({id: this.overlayID ,color: "red" });
  }

    componentDidMount() {
    this.stage = new NGL.Stage(this.container.current);

    const loadProteins = async () => {
        this.proteanArray = [];
        const proteanStructures = [];
        for (let i = 0; i < this.props.proteinPaths.length; i++) {
            let proteanStructureInfo = {};
            this.proteanArray.push(await this.stage.loadFile(this.props.proteinPaths[i]));
            this.proteanArray[i].addRepresentation('cartoon',{color: this.props.overlays?.[this.overlayID]?.color || "yellow"});

            const chains = this.proteanArray[i].structure.getAtomSet(); 
            // const chainInfo = chains.map((chain) => {
            //   const atoms = chain.getAtomIndices();
            //   const residues = chain.getResidueIndices();
            //   const aminoAcids = residues.map((residueIndex) => {
            //     const residue = chain.residueStore.resno[residueIndex];
            //     return residue;
            //   });
            //   return { atoms, residues, aminoAcids };
            // });
            
            // Add the structure info to the array
            proteanStructureInfo = {
              id : this.proteanArray[i].id,
              name : this.proteanArray[i].structure.name,
              path : this.proteanArray[i].structure.path,
              atomCount : this.proteanArray[i].structure.atomCount,
              // atomMapDict : this.proteanArray[i].structure.atomMap.dict,
              // atomMapList : this.proteanArray[i].structure.atomMap.list,
              //chainInfo : chainInfo,
            };
            proteanStructures.push(proteanStructureInfo);
        }
        let sequence = this.proteanArray[0].structure.getSequence().join("");
        let ft = new FeatureViewer.createFeature(sequence,
          '#fv1',
        {
            showAxis: true,
            showSequence: true,
            brushActive: true, //zoom
            toolbar:true, //current zoom & mouse position
            bubbleHelp:true, 
            zoomMax:50 //define the maximum range of the zoom
        });
        ft.addFeature({
          data: [{x:20,y:32},{x:46,y:100},{x:123,y:167}],
          name: "test feature 1",
          className: "test1", //can be used for styling
          color: "#0F8292",
          type: "rect" // ['rect', 'path', 'line']
      });

        this.props.setProteanArray({id: this.overlayID, proteans: proteanStructures});
        this.stage.autoView();
        this.stage.viewer.requestRender();
        // Add representations for the proteins
    }
    loadProteins();
    }  

    componentDidUpdate(prevProps) {
        this.proteanArray.forEach((protean) => {
        protean.addRepresentation('cartoon',{color: this.props.overlays[this.overlayID].color});
        });
        this.stage.autoView();
        this.stage.viewer.requestRender();
    }
  render() {
    return (
    <div className='visualizer-container '>
      <div ref={this.container} className="ngl-container" >
        <div id="fv1"></div>
          <OverlyComponent changeColor={this.props.changeColor} overlayID={this.overlayID} proteanArray={this.props?.overlays?.[this.overlayID]?.proteans|| []}/>
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

export default connect(mapStateToProps, mapDispatchToProps )(ProteinVisualizerComponent);



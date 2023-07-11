import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import * as NGL from 'ngl';
import OverlyComponent from './OverlyComponent';
import { addOverlay , removeOverlay , changeColor} from '../Stores/Reducers/OverlayReducer';


class ProteinVisualizerComponent extends Component {
  static propTypes = {
    proteinPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
    shoudlDisplaySuperImposed: PropTypes.bool.isRequired,
    addOverlay: PropTypes.func.isRequired,
    removeOverlay: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.stage = null; // Store the NGL.Stage instance here
    this.proteanArray = [];
    this.overlay = this.props.addOverlay({color: "red"});
  }

    componentDidMount() {
    this.stage = new NGL.Stage(this.container.current);

    const loadProteins = async () => {
        this.proteanArray = [];
        for (let i = 0; i < this.props.proteinPaths.length; i++) {
            this.proteanArray.push(await this.stage.loadFile(this.props.proteinPaths[i]));
            this.proteanArray[i].addRepresentation('cartoon',{color: this.overlay.color});
            this.proteanArray[i].autoView();
        }
        this.stage.autoView();
        this.stage.viewer.requestRender();
        // Add representations for the proteins
    }
    loadProteins();
    }  

    componentDidUpdate(prevProps) {
        this.proteanArray.forEach((protean) => {
        protean.addRepresentation('cartoon',{color: this.overlay.color});
        });
        this.stage.autoView();
        this.stage.viewer.requestRender();
    }
  render() {
    return (
    <div className='visualizer-container '>
      <div ref={this.container} className="ngl-container" >
          <OverlyComponent changeColor={this.props.changeColor} overlayID={this.props.overlay.id}/>
      </div>
    </div>
    );
  }
}

// Map Redux state to React component props
const mapStateToProps = (state) => {
  return {
    overlays: state.overlays.overlays,
  };
};


const mapDispatchToProps = {
  addOverlay,
  removeOverlay,
  changeColor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProteinVisualizerComponent);
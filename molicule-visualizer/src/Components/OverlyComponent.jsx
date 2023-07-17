import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FeatureViewer from 'feature-viewer';

export default class OverlyComponent extends Component {
  static propTypes = {
    overlayID: PropTypes.string.isRequired,
    changeColor: PropTypes.func.isRequired,
    proteanArray: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.config = {
      showAxis: true,
      showSequence: true,
      brushActive: true, //zoom
      toolbar:true, //current zoom & mouse position
      bubbleHelp:true,
      zoomMax:50, //define the maximum range of the zoom
      showVariants: false
    }
    this.FeatureViewerArrays = []
  }

  componentDidMount() {
    console.log(this.props.proteanArray); 
    this.createFeatureViewers();
    if(this.props.proteanArray.length > 0){
      console.log("createFeatureViewers");
      this.createFeatureViewers();
    }
  }

  componentDidUpdate(prevProps) {

    this.createFeatureViewers();
    
  }

  createFeatureViewers() {
    const { proteanArray } = this.props;

    proteanArray.forEach((protean, index) => {
      const featureViewerId = `#feature-viewer${index}-${protean.name}`;

        // Create a new FeatureViewer instance
        const featureViewer = new FeatureViewer.createFeature(
          protean.sequence,
          featureViewerId,
          {
            showAxis: true,
            showSequence: true,
            brushActive: true, //zoom
            toolbar:true, //current zoom & mouse position
            bubbleHelp:true,
            zoomMax:50, //define the maximum range of the zoom
            showVariants: false
          }
        );

    });
  }

  render() {
    return (
      <div className="overlay">
        {this.props.proteanArray.map((protean, index) => (
          <div className="overlay-container">
          <h3>{protean.name}</h3>
          <div id={ `feature-viewer${index}-${protean.name}`} ></div>
          </div>
        ))
        }
      </div>
    )
    }
}

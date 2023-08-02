import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FeatureViewer from 'feature-viewer';
import Draggable from 'react-draggable';
import '../Styles/OverlayStyles.css'
import { RepresentationRegistry } from 'ngl';
import { ApplyableReprisentations, RepMap } from '../Utils/ReprisentationListHelper';

export default class OverlyComponent extends Component {
  static propTypes = {
    overlayID: PropTypes.string.isRequired,
    changeColor: PropTypes.func.isRequired,
    proteanArray: PropTypes.array.isRequired,
    getProteanRepresentation: PropTypes.func.isRequired,
    removeProteanRepresentation: PropTypes.func.isRequired,
    addRepresentationToProtean: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.config = {
      showAxis: true,
      showSequence: true,
      brushActive: true, //zoom
      toolbar: true, //current zoom & mouse position
      bubbleHelp: false,
      zoomMax: 100, //define the maximum range of the zoom
      showVariants: false
    }
    this.FeatureViewerArrays = []
    this.ProteanReprisentations = [];
    this.applyableReprisentationList = [];

    this.createFeatureViewers = this.createFeatureViewers.bind(this);
    this.getApplyablePreriesentationList = this.getApplyablePreriesentationList.bind(this);

    this.state = {
      reprisentationList: [],
    };

    this.repExample = {
      type : ApplyableReprisentations['angle'].type,
      params : {
      }
    };
  }

  componentDidMount() {
    this.getApplyablePreriesentationList();
    this.createFeatureViewers();
    if (this.props.proteanArray.length > 0) {
      this.createFeatureViewers();
    }
  }

  componentDidUpdate(prevProps) {
    this.createFeatureViewers();
  }

  getApplyablePreriesentationList() {
    // getting this From NGL to get supported reprisentations this is a Map
    // access angle from applyablerepriesntations 
    
  }

  createFeatureViewers() {
    const { proteanArray } = this.props;

    for (let index = 0; index < proteanArray.length; index++) {
      const featureViewerId = `#feature-viewer${index}-${proteanArray[index].name}-${this.props.overlayID}`;

      // Check if the FeatureViewer instance exists
      if (this.FeatureViewerArrays[index]) {
        // If it exists, remove the existing HTML element associated with the viewer
        const existingViewerElement = document.querySelector(featureViewerId);
        if (existingViewerElement) {
          existingViewerElement.innerHTML = '';
        }
      }

      // Create a new FeatureViewer instance
      this.FeatureViewerArrays[index] = new FeatureViewer.createFeature(
        proteanArray[index].sequence,
        featureViewerId,
        this.config
      );

      this.FeatureViewerArrays[index].zoom(0, proteanArray[index].sequence.length);
      // Find the container element that holds the components you want to remove
      const container = document.querySelector('.multiple-variant-popup');

      // Find the .add-variant-btn button
      const addVariantButton = document.querySelector('.add-variant-btn');

      // If the .add-variant-btn button exists, remove it and its container
      if (addVariantButton) {
        // Remove the .add-variant-btn button
        addVariantButton.remove();

        // Check if the container element exists before removing it
        if (container) {
          // Remove the container element that holds the components you want to remove
          container.remove();
        }
      };
    }
  }

  render() {
    return (
      <Draggable bounds="parent">
      <div className="overlay-container">
        {this.props.proteanArray.map((protean, index) => (
          <div className="overlay" key={index}>
            <div>{protean.name}</div>
            <div id={`feature-viewer${index}-${protean.name}-${this.props.overlayID}`} className="feature-viewer-container"></div>
            {this.props.getProteanRepresentation(protean.name).map((representation, index) => (
              <div key={index}>
                {/* turn visibity on or off based on the radio button of reprisentation.visibility  */}
                <input 
                type="checkbox" 
                id={`representation-${representation.name}`} 
                name={`representation-${protean.name}`} 
                checked={representation.visible}
                onChange={(e) => {representation.setVisibility(e.target.checked);}}
                />
                <label htmlFor={`representation-${representation.name}`}>{representation.name}</label>
                <button onClick={() => this.props.addRepresentationToProtean(protean.name , this.repExample)}>remove Reprisentaion</button>
                
              </div>
            ))}
          </div>
        ))}
      </div>
      </Draggable>
    );
  }
}
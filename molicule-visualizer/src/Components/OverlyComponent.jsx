import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FeatureViewer from 'feature-viewer';
import Draggable from 'react-draggable';
import '../Styles/OverlayStyles.css'
import AddNewReprisentationPopUp from './AddNewReprisentationPopUp';
import CollapsibleComponent from './CollapsibleComponent';
import SequenceAlignment from './SequenceAlignment';

export default class OverlyComponent extends Component {
  static propTypes = {
    overlayID: PropTypes.string.isRequired,
    changeColor: PropTypes.func.isRequired,
    proteanArray: PropTypes.array.isRequired,
    getProteanRepresentation: PropTypes.func.isRequired,
    removeProteanRepresentation: PropTypes.func.isRequired,
    addRepresentationToProtean: PropTypes.func.isRequired,
    usAlignment: PropTypes.string,
    zoomAtAtom : PropTypes.func.isRequired,
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
      zoomMin: 0, //define the minimum range of the zoom
      showVariants: false,
    }
    this.FeatureViewerArrays = []
    this.ProteanReprisentations = [];
    this.applyableReprisentationList = [];

    this.createFeatureViewers = this.createFeatureViewers.bind(this);
    this.getApplyablePreriesentationList = this.getApplyablePreriesentationList.bind(this);

    this.state = {
      ProteanRepState: [],
      isPopupOpen: false,
    };
  }


  handleOpenPopup = () => {
    this.setState({ isPopupOpen: true });
  };

  handleClosePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  handleAddRepresentation = (proteanName, representation, parameters) => {
    console.log("Representation:", representation);
    console.log("Parameters:", parameters);
    // Here you can add the representation to the protean
    // this.props.addRepresentationToProtean(proteanName, { type: representation, params: parameters });
    this.props.addRepresentationToProtean(proteanName, { type: representation, params: parameters });
    this.handleClosePopup();
  };

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
      }
    }
  }

  render() {
    return (
      <Draggable bounds="parent" handle=".drag-handle">
        <div className="overlay-container">
          {this.props.proteanArray.map((protean, index) => (
            <div className="overlay" key={index}>
              <div>{protean.name}</div>
              <div className="drag-handle"> drage me here</div>
              <CollapsibleComponent>
                <div id={`feature-viewer${index}-${protean.name}-${this.props.overlayID}`} className="feature-viewer-container"></div>
                {this.props.getProteanRepresentation(protean.name).map((representation, index) => (
                  <div key={index}>
                    {/* turn visibity on or off based on the radio button of reprisentation.visibility  */}
                    <input
                      type="checkbox"
                      id={`representation-${representation.name}`}
                      name={`representation-${protean.name}`}
                      checked={representation.visible}
                      onChange={(e) => { representation.setVisibility(e.target.checked); this.setState({ checkMark: true }) }}
                    />
                    <label htmlFor={`representation-${representation.name}`}>{representation.name}</label>
                    <button onClick={() => { this.props.removeProteanRepresentation(protean.name, representation); this.setState({ checkMark: true }) }}>remove Reprisentaion</button>
                  </div>
                ))}
                <button id='Add-Rep-Button' onClick={this.handleOpenPopup}>Add Reprisentaion</button>
                <AddNewReprisentationPopUp
                  isOpen={this.state.isPopupOpen}
                  onClose={this.handleClosePopup}
                  onSubmit={this.handleAddRepresentation}
                  proteanName={protean.name}
                />
              </CollapsibleComponent>
            </div>
          ))}
          {this.props.usAlignment && <SequenceAlignment
            sequenceAlignment={this.props.usAlignment}
            onResidueClick={(residueNumber) => {
              this.props.zoomAtAtom(residueNumber);
            }}
          />}
        </div>
      </Draggable>
    );
  }
}
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import * as NGL from 'ngl';

export default class ProteinVisualizerComponent extends Component {
  static propTypes = {
    proteinPaths: PropTypes.arrayOf(PropTypes.string).isRequired,
    shoudlDisplaySuperImposed: PropTypes.bool.isRequired //TODO: maybe see if this is required
  }

  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.stage = null; // Store the NGL.Stage instance here
    this.proteanArray = [];
  }

    componentDidMount() {
    const stage = new NGL.Stage(this.container.current);

    const loadProteins = async () => {
        this.proteanArray = [];
        for (let i = 0; i < this.props.proteinPaths.length; i++) {
            this.proteanArray.push(await stage.loadFile(this.props.proteinPaths[i]));
            this.proteanArray[i].addRepresentation('cartoon');
            this.proteanArray[i].autoView();
        }
        stage.autoView();
        stage.viewer.requestRender();
        // Add representations for the proteins
    }
    loadProteins();
    }
  render() {
    return (
      <div ref={this.container} className="visualizer-container" />
    );
  }
}


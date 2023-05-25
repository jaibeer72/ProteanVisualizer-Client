import React, { Component } from 'react';
import * as NGL from 'ngl';

export default class VisualizerComponent extends Component {
 
  stage = null;
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    this.stage = new NGL.Stage(this.container.current);
    this.stage.loadFile('rcsb://7R5K', { defaultRepresentation: false }).then((component) => {
        const representations = component.addRepresentation('cartoon');
        this.stage.autoView();
        this.stage.setParameters({
            ambientOcclusion: true,
            ambientOcclusionStrength: 0.6,
          });
          
          // Apply custom colors
          representations.setColor('red');
    });
        // Apply hardware acceleration CSS to the container element
        this.container.current.style.transform = 'translateZ(0)';
  }


  render() {
    return <div ref={this.container} className="visualizer-container" />;
  }
}

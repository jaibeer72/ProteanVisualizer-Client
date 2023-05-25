import React, { Component } from 'react';
import * as NGL from 'ngl';

export default class ComparisonComponent extends Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
      }

    componentDidMount() {
    const stage = new NGL.Stage(this.container.current);

    const loadProteins = async () => {
      const protein1 = await stage.loadFile('rcsb://1CRN');
      const protein2 = await stage.loadFile('rcsb://1CSE');

      // Add representations for the proteins
      protein1.addRepresentation('cartoon', { color: 'red' });
      protein2.addRepresentation('cartoon', { color: 'blue' });

      // Create a diff representation
    //   const diff = new NGL.DiffRepresentation(protein1, protein2);
    //   diff.create();

    // Superimpose the proteins
    //   const align = new NGL.Align(protein1, protein2);
     //   align.run();

      stage.autoView();
      stage.viewer.requestRender();
    };

    loadProteins();
  }

  componentWillUnmount() {
    const stage = NGL.Stage.getStage('viewport');
    if (stage) {
      stage.dispose();
    }
    this.container.current.style.transform = 'translateZ(0)';
  }
  render() {
        return <div ref={this.container} className="visualizer-container" />;
  }
}
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
      const protein1 = await stage.loadFile('http://localhost:3003/TestProteans/SuperImposed.pdb.pdb');
      const protein2 = await stage.loadFile('rcsb://1CSE.pdb');

      // Add representations for the proteins
      protein1.addRepresentation('cartoon', { color: 'red' });
      protein2.addRepresentation('cartoon', { color: 'blue' });

      // Assuming you have the rotation matrix values stored in variables
const rotationMatrix = [
  [-0.1429300663, -0.9642663321, -0.2230727166],
  [-0.7725864851, -0.0321728578, 0.6340938655],
  [-0.6186122527, 0.2629740443, -0.7403806675]
];

const translationVector = [0, -23.5534790988, 9.5513851519];

// Iterate over each molecule in the structure
for (let i = 0; i < protein1.structure.numMolecules; i++) {
  const molecule = protein1.structure.getMoleculeProxy(i);

  // Iterate over each atom in the molecule
  for (let j = 0; j < molecule.atomCount; j++) {
    const atom = molecule.atomProxy[j];

    // Get the atom coordinates
    const x = atom.x;
    const y = atom.y;
    const z = atom.z;

    // Apply the rotation transformation
    const X = translationVector[0] + rotationMatrix[0][0] * x + rotationMatrix[0][1] * y + rotationMatrix[0][2] * z;
    const Y = translationVector[1] + rotationMatrix[1][0] * x + rotationMatrix[1][1] * y + rotationMatrix[1][2] * z;
    const Z = translationVector[2] + rotationMatrix[2][0] * x + rotationMatrix[2][1] * y + rotationMatrix[2][2] * z;

    // Update the atom coordinates
    atom.x = X;
    atom.y = Y;
    atom.z = Z;
  }
}
      //console.log(protein1.structure);
// const superposition = new NGL.Superposition(protein1.structure, protein2.structure);
//  protein1.setTransform(superposition.transformationMatrix); 
  //protein2.setTransform(superposition.transformationMatrix);
//superposition.align();
    protein1.updateRepresentations({position: true});

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
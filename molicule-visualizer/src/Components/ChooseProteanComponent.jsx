import React, { Component } from 'react'
import ProteanSearchComponent from './ProteanSearchComponent';
import ProteanVisualizerComponent from './ProteinVisualizerComponent';
import { fetchSuperimposedPDBFile } from '../Utils/AxiosCallsHelper';

export default class ChooseProteanComponent extends Component {

    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            protean1: null,
            protean2: null,
            superImposed: null,
            showCompare: false,
        }
    }

    handleProtean1Selection = (proteanSequenceData) => {
        this.setState({ protean1: proteanSequenceData });
    };

    handleProtean2Selection = (proteanSequenceData) => {
        this.setState({ protean2: proteanSequenceData });
        fetchSuperimposedPDBFile(this.state.protean1, proteanSequenceData).then(async (response) => {
            const { superimposedPDB, usalignOutput } = response;
            this.setState({ superImposed: superimposedPDB, showCompare: true , usalignOutput: usalignOutput });
        });

    };

    render() {
        return (
            <div className='ChooseProteanContainer'>
                {/* // add serach for protean 1
            // if protean 1 is chosen add serach for protean 2
            // Diplay the 2 proteans 
            // when 2 proteans exist add the compare button.
            // when compare button is pressed call the protean compare api and display the result. in third visualizer */}
                {(this.state.protean1 === null) ? <ProteanSearchComponent onSelectProtean={this.handleProtean1Selection} /> : null}
                {this.state.protean1 && <ProteanVisualizerComponent proteinSequences={[`rcsb://${this.state.protean1}.pdb`]} shoudlDisplaySuperImposed={false} />}
                {(this.state.protean1 && this.state.protean2 === null) ? <ProteanSearchComponent onSelectProtean={this.handleProtean2Selection} /> : null}
                {this.state.protean1 && this.state.protean2 && <ProteanVisualizerComponent proteinSequences={[`rcsb://${this.state.protean2}.pdb`]} shoudlDisplaySuperImposed={false} />}
                {this.state.protean1 && this.state.protean2 && this.state.superImposed && this.state.showCompare === true &&
                    <ProteanVisualizerComponent 
                    proteinSequences={[this.state.superImposed, `rcsb://${this.state.protean2}.pdb`]} 
                    shoudlDisplaySuperImposed={true} 
                    usAlignment={this.state.usalignOutput}
                    />
                }

            </div>
        )
    }
}
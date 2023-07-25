import React, { Component } from 'react'
import ProteanSearchComponent from './ProteanSearchComponent';
import ProteanVisualizerComponent from './ProteinVisualizerComponent';

export default class ChooseProteanComponent extends Component {

    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            protean1: null,
            protean2: null,
            showCompareButton: false,
        }
    }

    handleProtean1Selection = (proteanSequenceData) => {
        this.setState({ protean1: proteanSequenceData});
    };

    handleProtean2Selection = (proteanSequenceData) => {
        this.setState({ protean2: proteanSequenceData, showCompareButton: true });
    };

    componentDidMount() {

    }

    render() {
        return (
            <div className='ChooseProteanContainer'>
                {/* // add serach for protean 1
            // if protean 1 is chosen add serach for protean 2
            // Diplay the 2 proteans 
            // when 2 proteans exist add the compare button.
            // when compare button is pressed call the protean compare api and display the result. in third visualizer */}
                {
                (this.state.protean1 === null) ? <ProteanSearchComponent onSelectProtean={this.handleProtean1Selection}/> : 
                <ProteanVisualizerComponent proteinSequences={[`rcsb://${this.state.protean1}.pdb`]} shoudlDisplaySuperImposed={false}/>
                }
    
            </div>
        )
    }
}
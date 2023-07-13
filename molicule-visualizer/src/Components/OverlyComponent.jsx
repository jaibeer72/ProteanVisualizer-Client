import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class OverlyComponent extends Component {
  static propTypes = {
    overlayID: PropTypes.string.isRequired,
    changeColor: PropTypes.func.isRequired,
    proteanArray: PropTypes.array.isRequired,
  }

  componentDidMount() {
    console.log(this.props.proteanArray);
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.proteanArray);
  }
  
    constructor(props) {
    super(props);
    this.container = React.createRef();
    }

  render() {
    return (
      <div className="overlay">
      {/* {this.props.proteanArray.map((protean) => (
        <div key={protean.id}>
          <h4>{protean.name}</h4>
          {protean.chainInfo.map((chain, index) => (
            <div key={index}>
              <h5>Chain {index + 1}</h5>
              <p>Atoms: {chain.atoms.join(', ')}</p>
              <p>Residues: {chain.residues.join(', ')}</p>
              <p>Amino Acids: {chain.aminoAcids.join(', ')}</p>
            </div>
          ))}
        </div>
      ))} */}
      <h3>UI Overlay Panel</h3>
      <button onClick={()=> {this.props.changeColor({id:this.props.overlayID})}}>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
      </div>
    )
    }
}

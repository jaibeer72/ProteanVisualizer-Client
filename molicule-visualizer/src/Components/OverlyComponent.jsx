import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class OverlyComponent extends Component {
  static propTypes = {
    overlayID: PropTypes.string.isRequired,
    changeColor: PropTypes.func.isRequired,
  }
  
    constructor(props) {
    super(props);
    this.container = React.createRef();
    }

  render() {
    return (
      <div className="overlay">
      <h3>UI Overlay Panel</h3>
      <button onClick={()=> {this.props.changeColor({id:this.props.overlayID})}}>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
      </div>
    )
    }
}

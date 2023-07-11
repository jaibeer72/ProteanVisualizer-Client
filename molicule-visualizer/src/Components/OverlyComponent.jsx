import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { changeColor } from '../Stores/Reducers/OverlayReducer';

class OverlyComponent extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    overlayID: PropTypes.string.isRequired,
  }
  
    constructor(props) {
    super(props);
    this.container = React.createRef();
    this.color = props.color;
    this.id = props.overlayID;
    }

  render() {
    return (
      <div className="overlay">
      <h3>UI Overlay Panel</h3>
      <button onClick={changeColor(this.overlayID)}>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
      </div>
    )
    }
}


// Map Redux state to React component props
const mapStateToProps = (state) => {
  return {
    overlays: state.overlay.overlays,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeColor: (payload) => dispatch(changeColor(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OverlyComponent);
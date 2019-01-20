import React, { Component } from "react";
import PropTypes from "prop-types";

class BounsDriverController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: this.props.driver
    };
  }

  handleUpdate() {
    const driver = {
      x: this.refs.x.value,
      y: this.refs.y.value
    };
    if (driver.x >= 0 && driver.x <= 200 && driver.y >= 0 && driver.y <= 200)
      this.props.update(driver);
    else alert("out of range(0-200)!");
  }

  render() {
    const { driver } = this.state;
    return (
      <div className="inputBox">
        <label>Bouns Driver Location:</label>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              X:
            </span>
          </div>
          <input
            type="number"
            className="form-control"
            defaultValue={driver.x}
            ref="x"
          />
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">
              Y:
            </span>
          </div>
          <input
            type="number"
            className="form-control"
            defaultValue={driver.y}
            ref="y"
          />
        </div>
        <button
          onClick={this.handleUpdate.bind(this)}
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    );
  }
}

BounsDriverController.propTypes = {
  items: PropTypes.array,
  driver: PropTypes.object.isRequired,
  update: PropTypes.func
};

export default BounsDriverController;

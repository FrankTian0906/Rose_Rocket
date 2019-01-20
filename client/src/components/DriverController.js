import React, { Component } from "react";
import PropTypes from "prop-types";

class DriverController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.legs,
      driver: this.props.driver
    };
  }

  handleUpdate() {
    const driver = {
      activeLegID: this.refs.selectedLeg.value,
      legProgress: this.refs.selectedRange.value
    };
    this.props.update(driver);
  }
  /* OLD  button handler
  handleUpdate_OLD() {
    const driver = {
      activeLegID: this.refs.selectedLeg.value,
      legProgress: this.refs.selectedProgress.value
    };
    if (driver.legProgress >= 0 && driver.legProgress <= 100)
      this.props.update(driver);
    else alert("out of range!(0-100)");
  }*/

  render() {
    const { items, driver } = this.state;
    console.log("Driver-items:", items);
    return (
      <div className="inputBox">
        <label>Driver Location:</label>
        <div className="form-group">
          <select
            id="inputState"
            className="form-control"
            defaultValue={driver.activeLegID}
            ref="selectedLeg"
            onChange={this.handleUpdate.bind(this)}
          >
            {items.map(item => (
              <option key={item.legID}>{item.legID}</option>
            ))}
          </select>

          {/* OLD Textbox input
          <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-sm">
                Percentage(%):
              </span>
            </div>
            <input
              type="number"
              className="form-control"
              defaultValue={driver.legProgress}
              ref="selectedProgress"
            />
          </div>*/}

          <input
            type="range"
            className="custom-range"
            id="customRange1"
            ref="selectedRange"
            defaultValue={driver.legProgress}
            onChange={this.handleUpdate.bind(this)}
          />
          {/* OLD Button for textbox-input
          <button
            onClick={this.handleUpdate_OLD.bind(this)}
            className="btn btn-primary"
          >
            Submit
          </button>
          */}
        </div>
      </div>
    );
  }
}

DriverController.propTypes = {
  items: PropTypes.array,
  driver: PropTypes.object.isRequired,
  update: PropTypes.func
};

export default DriverController;

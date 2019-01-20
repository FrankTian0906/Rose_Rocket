import React from "react";
import PropTypes from "prop-types";

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
  Hint
} from "react-vis";

class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: this.props.stops,
      legs: this.props.legs,
      driver: this.props.driver,
      bonusDriverLocation: this.props.bonusDriverLocation,

      value: null,
      path: [],
      bonusPath: [],
      driverLocation: null,
      driverLocationSign: false
    };
  }

  componentDidMount() {
    this.getDriverLocation();
    this.getPath();
    this.getBonusPath();
  }

  //update driver and bonus driver
  componentWillReceiveProps(nextprops) {
    console.log("MAP-state", nextprops.driver);
    this.setState({
      driver: nextprops.driver,
      bonusDriverLocation: nextprops.bonusDriverLocation
    });
    this.componentDidMount();
  }

  // get stop location by its name
  getStopLocation(stopName) {
    return this.state.stops.filter(stop => {
      return stop.name === stopName;
    });
  }

  //get driver locaton
  getDriverLocation() {
    setTimeout(() => {
      const { driver } = this.state;
      const start = driver.activeLegID.substring(0, 1);
      const end = driver.activeLegID.substring(1, 2);

      const startStop = this.getStopLocation(start);
      const endStop = this.getStopLocation(end);

      // current position
      const x =
        (driver.legProgress / 100) * (endStop[0].x - startStop[0].x) +
        startStop[0].x;
      const y =
        (driver.legProgress / 100) * (endStop[0].y - startStop[0].y) +
        startStop[0].y;
      console.log("-LOCATION", x, y);
      this.setState({
        driverLocation: { name: "driver", x: x, y: y },
        driverLocationSign: true
      });
    });
  }

  //get path from Stop "A" to current driver position
  getPath() {
    setTimeout(() => {
      const { stops, driver, driverLocation } = this.state;
      console.log("MAP-Current Location", driverLocation);
      let path = [];
      let activeLegEnd = driver.activeLegID;
      activeLegEnd = activeLegEnd.substring(1, 2);
      for (let i = 0; i < stops.length; i++) {
        const name = stops[i].name;
        if (name === activeLegEnd) break;
        path.push(stops[i]);
      }
      path.push(driverLocation);
      this.setState({
        path: path
      });
    });
  }

  //Calculate the distance between 2 points
  distance(start, end) {
    return Math.sqrt(
      Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
    );
  }

  // get bonus path from bonus location to the end stop
  getBonusPath() {
    setTimeout(() => {
      const { stops, bonusDriverLocation } = this.state;
      console.log("MAP-Bouns Location", bonusDriverLocation);
      let path = [];
      let minPath = Number.MAX_VALUE;
      let minStopNumber = 0;
      for (let i = 0; i < stops.length; i++) {
        const pathLength = this.distance(stops[i], bonusDriverLocation);

        if (pathLength < minPath) {
          minPath = pathLength;
          minStopNumber = i;
        }
      }
      path.push(bonusDriverLocation);
      for (let i = minStopNumber; i < stops.length; i++) {
        path.push(stops[i]);
      }
      this.setState({
        bonusPath: path
      });
    });
  }

  //Calculate the length of the total legs
  timeAllLegs(legs) {
    let totalTime = 0;

    legs.map(leg => {
      const startName = leg.legID.substring(0, 1);
      const endName = leg.legID.substring(1, 2);
      const speedLimt = leg.speedLimit;
      const startPosition = this.getStopLocation(startName);
      const endPosition = this.getStopLocation(endName);
      const distance = this.distance(startPosition[0], endPosition[0]);
      totalTime += distance / speedLimt;
      return null;
    });

    return totalTime.toFixed(2);
  }

  //Calculate the length of (rest distance + rest legs)
  timeRestLegs(driver, driverCurrentLocation, legs) {
    let restTime = 0;
    let restLegs = legs.filter(leg => {
      if (leg.legID.substring(1, 2) > driver.activeLegID.substring(1, 2))
        return leg;
      return null;
    });
    if (restLegs.length > 0) {
      // from driver current point to the next stop
      const startName = restLegs[0].legID.substring(0, 1);
      const speedLimt = restLegs[0].speedLimit;
      const startPosition = this.getStopLocation(startName);
      const distance = this.distance(startPosition[0], driverCurrentLocation);
      restTime += distance / speedLimt;

      // the rest of legs
      restLegs.map(leg => {
        const startName = leg.legID.substring(0, 1);
        const endName = leg.legID.substring(1, 2);
        const speedLimit = leg.speedLimit;
        const startPosition = this.getStopLocation(startName);
        const endPosition = this.getStopLocation(endName);
        const distance = this.distance(startPosition[0], endPosition[0]);
        restTime += distance / speedLimit;
        return null;
      });
    } else {
      // driver in the last leg(KL)
      const endName = legs[legs.length - 1].legID.substring(1, 2);
      const speedLimit = legs[legs.length - 1].speedLimit;
      const endPosition = this.getStopLocation(endName);
      const distance = this.distance(endPosition[0], driverCurrentLocation);
      restTime += distance / speedLimit;
    }
    return restTime.toFixed(2);
  }

  _forgetValue = () => {
    this.setState({
      value: null
    });
  };

  _rememberValue = value => {
    this.setState({ value });
  };

  render() {
    const {
      value,
      stops,
      path,
      legs,
      driver,
      driverLocation,
      bonusPath
    } = this.state;
    console.log("MAP-RENDER!", stops, legs, driver, bonusPath);
    return (
      <div>
        <XYPlot width={700} height={600}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineMarkSeries
            onValueMouseOver={this._rememberValue}
            onValueMouseOut={this._forgetValue}
            data={this.state.stops}
            color="lightblue"
            size="10px"
          />
          <LineMarkSeries
            onValueMouseOver={this._rememberValue}
            onValueMouseOut={this._forgetValue}
            data={path}
            color="green"
            size="10px"
          />
          <LineMarkSeries
            onValueMouseOver={this._rememberValue}
            onValueMouseOut={this._forgetValue}
            data={bonusPath}
            color="yellow"
            size="10px"
          />

          {value ? <Hint value={value} /> : null}
        </XYPlot>
        <div>
          <p>Total length: {this.timeAllLegs(legs)} h</p>
          {this.state.driverLocationSign && (
            <p>
              Rest length: {this.timeRestLegs(driver, driverLocation, legs)} h
            </p>
          )}
        </div>
      </div>
    );
  }
}

Maps.propTypes = {
  stops: PropTypes.array.isRequired,
  legs: PropTypes.array.isRequired,
  driver: PropTypes.object.isRequired
};

export default Maps;

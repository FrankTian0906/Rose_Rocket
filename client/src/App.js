import React, { Component } from "react";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";

import Maps from "./components/Maps";
import DriverController from "./components/DriverController";
import BounsDriverController from "./components/BounsDriverController";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: [],
      legs: [],
      driver: null,
      bounsDriver: null,

      finishedSign: false,
      stopsSign: false,
      legsSign: false,
      driverSign: false,
      bounsDriverSign: false
    };
  }

  componentDidMount() {
    this.getStops();
    this.getLegs();
    this.getDriver();
    this.getBonusDriver();
  }

  componentDidUpdate() {
    this.putDriver(this.state.driver);
    this.putBounsDriver(this.state.bounsDriver);
  }

  // garentee all of data have recived
  checkFinished() {
    const { stopsSign, legsSign, driverSign, bounsDriverSign } = this.state;
    const mark = stopsSign && legsSign && driverSign && bounsDriverSign;
    if (mark)
      this.setState({
        finishedSign: mark
      });
  }

  // GET/STOPS API
  getStops() {
    fetch("/api/stops")
      .then(res => res.json())
      .then(stops => {
        this.setState({ stops: stops, stopsSign: true }, () =>
          console.log("stops fetched !", stops)
        );
        this.checkFinished();
      });
  }

  // GET/LEGS API
  getLegs() {
    fetch("/api/legs")
      .then(res => res.json())
      .then(legs => {
        this.setState({ legs: legs, legsSign: true }, () =>
          console.log("legs fetched !", legs)
        );
        this.checkFinished();
      });
  }

  // GET/Driver API
  getDriver() {
    fetch("/api/driver")
      .then(res => {
        return res.json();
      })
      .then(driver => {
        this.setState(
          {
            driver: driver,
            driverSign: true
          },
          () => console.log("driver fetched !", driver)
        );
        this.checkFinished();
      });
  }

  // PUT/Driver API
  putDriver(driver) {
    console.log("PUT API", driver);
    fetch("/api/driver", {
      method: "PUT",
      mode: "CORS",
      body: JSON.stringify(driver),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res;
      })
      .catch(err => err);
  }

  // PUT/BonusDriver API
  putBounsDriver(driver) {
    console.log("PUT BONUS API", driver);
    fetch("/api/bonusDriver", {
      method: "PUT",
      mode: "CORS",
      body: JSON.stringify(driver),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res;
      })
      .catch(err => err);
  }

  // GET/BonusDriver API
  getBonusDriver() {
    fetch("/api/bonusDriver")
      .then(res => {
        return res.json();
      })
      .then(driver => {
        this.setState(
          {
            bounsDriver: driver,
            bounsDriverSign: true
          },
          () => console.log("bonus driver fetched !", driver)
        );
        this.checkFinished();
      });
  }

  //update driver position
  updateDriver = driver => {
    this.setState({
      driver: driver
    });
  };

  bounsUpdateDriver = driverLocation => {
    this.setState({
      bounsDriver: driverLocation
    });
  };

  renderMaps() {
    return (
      <Maps
        stops={this.state.stops}
        legs={this.state.legs}
        driver={this.state.driver}
        bonusDriverLocation={this.state.bounsDriver}
      />
    );
  }

  renderDriverController() {
    return (
      <DriverController
        legs={this.state.legs}
        driver={this.state.driver}
        update={this.updateDriver}
      />
    );
  }

  renderBounsDriverController() {
    return (
      <BounsDriverController
        driver={this.state.bounsDriver}
        update={this.bounsUpdateDriver}
      />
    );
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3 col-md-3">
            <h2>MAPS</h2>
            <div>
              {this.state.finishedSign && this.renderDriverController()}
            </div>
            <div>
              {this.state.finishedSign && this.renderBounsDriverController()}
            </div>
          </div>
          <div className="col-sm-8 col-md-8">
            {this.state.finishedSign && this.renderMaps()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

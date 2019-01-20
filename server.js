const express = require("express");
const app = express();

const Stops = require("./data/Stops");
const Legs = require("./data/Legs");
const Driver = require("./data/Driver");
const BonusDriver = require("./data/BonusDriver");

app.get("/api/stops", (req, res) => {
  console.log(res);
  res.json(Stops);
});

app.get("/api/legs", (req, res) => {
  res.json(Legs);
});

app.get("/api/driver", (req, res) => {
  res.json(Driver);
});

app.get("/api/bonusDriver", (req, res) => {
  res.json(BonusDriver);
});

app.put("/api/driver", function(req, res) {
  var driver = req.body;
  console.log("PUT driver", driver);
  Driver = driver;
});

app.put("/api/bnusDriver", function(req, res) {
  var driver = req.body;
  console.log("PUT bouns driver", driver);
  BonusDriver = driver;
});

const port = 5000;
app.listen(port, () => console.log("Server started on port ${port}"));

const express = require("express");
const cors = require("cors");
const auth = require("../routes/auth");
const user = require("../routes/users");
const rental = require("../routes/rentals");
const movie = require("../routes/movies");
const genre = require("../routes/genres");
const customer = require("../routes/customers");
const home = require("../routes/home");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use(express.static("public"));
  app.use("/", home);
  app.use("/auth", auth);
  app.use("/users", user);
  app.use("/rentals", rental);
  app.use("/movies", movie);
  app.use("/customers", customer);
  app.use("/genres", genre);

  app.use(error);
};

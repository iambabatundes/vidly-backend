const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.set("strictQuery", true);

  mongoose
    .connect("mongodb://127.0.0.1:27017/vidly")
    .then(() => winston.info("Connected to mongodb..."));
};

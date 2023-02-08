const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose.set("strictQuery", true);

  mongoose;
  const db = config
    .get("db")
    .connect(db)
    .then(() => winston.info(`Connected to ${db}...`));
};

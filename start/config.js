const config = require("config");
const winston = require("winston");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    winston.log("FATE ERROR: jwtPrivateKey was not defined");
  }
};

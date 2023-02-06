const config = require("config");
const winston = require("winston");
const express = require("express");
const app = express();

require("./start/routes")(app);
require("./start/db")();
require("./start/logger")();
require("./start/config")();

const port = process.env.PORT || config.get("port");
app.listen(port, () => winston.info(`Listening on port ${port}`));

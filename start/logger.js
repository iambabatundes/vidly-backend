const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log("Something failed while starting up", ex);
    winston.error("Something failed while starting up", ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    winston.error("Something Failed while starting up", ex);
    process.exit(1);
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://127.0.0.1:27017/vidly",
      options: { useUnifiedTopology: true },
    })
  );
};

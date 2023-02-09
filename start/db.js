const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.DB_URL)
    .then(() => winston.info(`Connected to ${process.env.DB_URL}`));

  // mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};

// MongoDB

// const MongoClient = require('mongodb').MongoClient;

// MongoClient.connect(process.env.DB_URL, function(err, db) {
//   if(!err) {
//     console.log("We are connected");
//   }
// });

const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minLenght: 5,
    maxLength: 50,
    required: true,
    trim: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function getValidation(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = getValidation;

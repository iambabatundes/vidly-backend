const Joi = require("joi");
const { genreSchema } = require("./genre");
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 255,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },

  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
});

const Movie = new mongoose.model("Movies", movieSchema);

function getValidation(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = getValidation;

const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          minLength: 3,
          maxLength: 50,
          required: true,
          trim: true,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
      }),
      required: true,
    },

    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          trim: true,
          minLength: 5,
          maxLength: 255,
          required: true,
        },
        dailyRentalRate: {
          type: Number,
          min: 0,
          max: 255,
          required: true,
        },
      }),
      required: true,
    },

    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },

    dateReturned: {
      type: Date,
    },

    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function getValidation(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = getValidation;

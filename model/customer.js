const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = new mongoose.model(
  "Customer",
  new mongoose.Schema({
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
  })
);

function getValidation(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = getValidation;

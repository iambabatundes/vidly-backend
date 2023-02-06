const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 255,
    require: true,
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 255,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true,
  },

  isAdmin: Boolean,
});

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {
//       _id: user._id,
//       name: name,
//       email: email,
//       isAdmin: isAdmin,
//     },
//     config.get("jwtPrivateKey")
//   );
//   return token;
// };

const User = new mongoose.model("User", userSchema);

function getValidation(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = getValidation;

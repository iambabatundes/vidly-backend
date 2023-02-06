const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const { User } = require("../model/user");
const asyncMiddleware = require("../middleware/async");

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email and password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email and password");

    // const token = user.generateAuthToken();

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      config.get("jwtPrivateKey")
    );

    res.send(token);
  })
);

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
  });

  return schema.validate(req);
}

module.exports = router;

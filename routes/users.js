const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../middleware/async");
const { User, validate } = require("../model/user");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({ id: req.user._id }).select("-password");
  res.send(user);
});

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      config.get("jwtPrivateKey")
    );

    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "name", "email"]));
  })
);

module.exports = router;

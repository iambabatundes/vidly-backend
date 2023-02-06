const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const { Customer } = require("../model/customer");
const { Movie } = require("../model/movie");
const { Rental, validate } = require("../model/rental");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.find();

    res.send(rental);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Invalid Customer");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Invalid Movie");

    if (movie.numberInStock === 0) res.status(404).send("Movie not in Stock");

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    try {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        await rental.save();
        movie.numberInStock--;
        movie.save();
        res.send(rental);
      });

      session.endSession();
      console.log("Successful");
    } catch (error) {
      console.log("Something fails", error.message);
    }
  })
);

router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      {
        customerId: req.body.customerId,
        movieId: req.body.movieId,
      },
      { new: true }
    );
    if (!rental)
      return res.status(404).send("The rental with the given ID doesn't exist");

    res.send(rental);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental)
      return res
        .status(404)
        .send("The rental with the given ID couldn't be found");

    res.send(rental);
  })
);

module.exports = router;

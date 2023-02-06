const express = require("express");
const router = express.Router();

const { Movie, validate } = require("../model/movie");
const auth = require("../middleware/auth");
const { Genre } = require("../model/genre");
const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.find().sort();

    res.send(movie);
  })
);

router.post(
  "/",
  [auth],
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid Genre");

    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    movie = await movie.save();
    res.send(movie);
  })
);

router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  })
);

router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie)
      return res
        .status(404)
        .send("The movie with the given ID could't be found");

    res.send(movie);
  })
);

router.get(
  "/:id",
  validateObjectId,

  asyncMiddleware(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).send("The movie with the given Id couldn't be found");
    }

    res.send(movie);
  })
);

module.exports = router;

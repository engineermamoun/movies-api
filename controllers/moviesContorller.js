const Movie = require("../models/movie");

/**
 * Creates a new movie document and saves it to the database.
 *
 * @param {object} req - The request object, containing the movie details in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with a success message and the created movie data.
 */
exports.create = async (req, res) => {
  const { name, category, description } = req.body;
  const movie = Movie({ name, category, description });

  await movie.save(); // Save the new movie document

  res.json({ success: true, data: movie }); // Respond with the created movie data
};

/**
 * Finds a movie by its ID and returns it.
 *
 * @param {object} req - The request object, containing the movie ID in `req.params`.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} A promise that resolves with the found movie data or a 401 error if not found.
 */
exports.find = async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  if (!movie) return res.status(401).send(); // Respond with 401 if movie not found
  res.json({ success: true, data: movie }); // Respond with the found movie data
};

/**
 * Updates a movie document by its ID.
 *
 * @param {object} req - The request object, containing the movie ID in `req.params` and updated details in `req.body`.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} A promise that resolves with a success message.
 */
exports.update = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, category } = req.body;
  await Movie.updateOne(
    { _id: id },
    {
      $set: {
        name,
        category,
        description,
      },
    }
  );
  res.json({ success: true }); // Respond with a success message
};

/**
 * Deletes a movie document by its ID.
 *
 * @param {object} req - The request object, containing the movie ID in `req.params`.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} A promise that resolves with a success message.
 */
exports.delete = async (req, res, next) => {
  const { id } = req.params;
  await Movie.deleteOne({ _id: id }); // Delete the movie document
  res.json({ success: true }); // Respond with a success message
};

/**
 * Lists all movies with pagination.
 *
 * @param {object} req - The request object, containing the page number in `req.query`.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} A promise that resolves with the paginated list of movies.
 */
exports.list = async (req, res, next) => {
  const page = req.query?.page || 1;
  const limit = 2;
  const skip = (page - 1) * limit;
  const movies = await Movie.find().select("-review").skip(skip).limit(limit); // Get paginated movies
  const total = await Movie.countDocuments(); // Get total number of movies
  const pages = Math.ceil(total / limit); // Calculate total pages
  res.json({ success: true, pages, data: movies }); // Respond with paginated movies
};

/**
 * Adds a review to a movie.
 *
 * @param {object} req - The request object, containing the movie ID in `req.params` and review details in `req.body`.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} A promise that resolves with a success message or an error if the review already exists.
 */
exports.addReview = async (req, res, next) => {
  const { id } = req.params;
  const { comment, rate } = req.body;

  const movie = await Movie.findById(id);
  if (!movie) return res.status(404).send(); // Respond with 404 if movie not found

  // Check if the user has already rated the movie
  const isRated = movie.review.findIndex((m) => m.user == req.userId);
  if (isRated > -1)
    return res.status(403).send({ message: "Review is already added." });

  const totalRate = movie.review.reduce(
    (sum, review) => sum + review.rate || 0,
    0
  );
  const finalRate = (totalRate + rate) / (movie.review.length + 1);

  await Movie.updateOne(
    { _id: id },
    {
      $push: {
        review: {
          user: req.userId,
          comment,
          rate,
        },
      },
      $set: {
        rate: finalRate,
      },
    }
  );
  res.status(201).json({ success: true }); // Respond with a success message
};

/**
 * Lists all reviews for a movie.
 *
 * @param {object} req - The request object, containing the movie ID in `req.params`.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise} A promise that resolves with the list of reviews or a 404 error if the movie is not found.
 */
exports.reviews = async (req, res, next) => {
  const { id } = req.params;
  const movie = await Movie.findById(id)
    .select("-review._id") // Exclude review item IDs
    .populate("review.user", "name"); // Populate user details in reviews
  if (!movie) return res.status(404).send(); // Respond with 404 if movie not found

  res.json({ success: true, data: movie.review }); // Respond with the list of reviews
};

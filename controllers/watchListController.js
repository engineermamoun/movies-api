const User = require("../models/user");

/**
 * Adds a movie to the user's watchlist or updates the watched status if it already exists.
 *
 * @param {object} req - The request object, containing the movie and watched status in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with a success message and the updated user data.
 */
exports.add = async (req, res) => {
  const { movie, watched } = req.body;
  const user = await User.findById(req.userId); // Find the user by ID
  const index = user.watchList.findIndex((e) => e.movie == movie); // Check if the movie is already in the watchlist
  if (index > -1) {
    user.watchList[index].watched = watched; // Update the watched status if the movie exists
  } else {
    user.watchList.push({ movie, watched }); // Add the movie to the watchlist if it doesn't exist
  }
  await user.save(); // Save the updated user document
  res.json({
    success: true,
    data: user, // Respond with the updated user data
  });
};

/**
 * Deletes a movie from the user's watchlist.
 *
 * @param {object} req - The request object, containing the movie ID in `req.params`.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with a success message.
 */
exports.delete = async (req, res) => {
  const { movie } = req.params;
  const user = await User.findById(req.userId); // Find the user by ID
  console.log(movie);
  console.log(user.watchList);
  user.watchList = user.watchList.filter((e) => e.movie != movie); // Remove the movie from the watchlist
  console.log(user.watchList);
  await user.save(); // Save the updated user document

  res.json({
    success: true, // Respond with a success message
  });
};

/**
 * Lists all movies in the user's watchlist.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with the user's watchlist data.
 */
exports.list = async (req, res) => {
  const user = await User.findById(req.userId)
    .select("-watchList._id") // Exclude the watchlist item IDs
    .populate("watchList.movie", ["name", "category"]); // Populate the movie details
  console.log(user);
  res.json({
    success: true,
    data: user.watchList, // Respond with the user's watchlist data
  });
};

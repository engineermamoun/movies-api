const User = require("../models/user");
const jwtHelpser = require("../utils/jwtHelpser");
const bcrypt = require("bcrypt");

/**
 * Registers a new user by saving their details to the database.
 *
 * @param {object} req - The request object, containing the user's name, email, and password in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with a success message or an error message if registration fails.
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 8), // Hash the password before saving
  });
  try {
    await user.save(); // Save the new user document
    res.status(200).json({
      success: true, // Respond with a success message
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong", // Respond with an error message if registration fails
    });
  }
};

/**
 * Logs in a user by verifying their credentials and returning a JWT token.
 *
 * @param {object} req - The request object, containing the user's email and password in `req.body`.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with a success message and JWT token or an error message if login fails.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // Find the user by email
  if (user && bcrypt.compareSync(password, user.password)) { // Verify the password
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        accessToken: jwtHelpser.sign({ sub: user.id }), // Generate a JWT token
      },
    });
  } else {
    res.status(401).json({
      message: "Invalid Credentials", // Respond with an error message if login fails
    });
  }
};

/**
 * Retrieves the authenticated user's details.
 *
 * @param {object} req - The request object, containing the user's ID in `req.userId`.
 * @param {object} res - The response object.
 * @returns {Promise} A promise that resolves with the user's details.
 */
exports.me = async (req, res) => {
  const user = await User.findById(req.userId); // Find the user by ID
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};


// Middleware to check if the current user is an admin

const User = require("../models/user");

exports.check = async (req, res, next) => {
  const user = await User.findById(req.userId); // Find the user by ID
  user.isAdmin
    ? next() // If the user is an admin, proceed to the next middleware
    : res.status(403).json({
        message: "Forbidden!", // If not, respond with a 403 Forbidden error
      });
};

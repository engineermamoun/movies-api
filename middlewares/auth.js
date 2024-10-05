const jwtHelpeser = require("../utils/jwtHelpeser");

// Middleware to check if the user is authenticated
exports.check = (req, res, next) => {
  let token = req.headers["authorization"]; // Retrieve the token from the request headers
  token = token?.replace("Bearer", "")?.trim(); // Remove "Bearer" prefix and trim whitespace
  const payload = jwtHelpeser.verify(token); // Verify the token and get the payload
  if (payload) {
    req.userId = payload.sub; // Attach the user ID to the request object
    return next(); // Proceed to the next middleware
  }
  res.status(401).json({
    message: "Unauthorized!", // Respond with a 401 Unauthorized error if verification fails
  });
};

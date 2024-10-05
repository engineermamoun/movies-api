// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");

// Retrieve secret key and expiration time from environment variables
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

// Function to sign a JWT with a given payload
exports.sign = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Function to verify a given JWT
exports.verify = (token) => {
  try {
    return jwt.verify(token, secret); // Verify the token using the secret key
  } catch (e) {
    return false; // Return false if verification fails
  }
};

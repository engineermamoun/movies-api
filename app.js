// Import necessary modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Import route handlers
const indexRouter = require("./routes/index");
const testRoute = require("./routes/test");
const authRoute = require("./routes/auth");
const movieRoute = require("./routes/movie");
const watchlistRoute = require("./routes/watchList");

// Initialize the Express application
const app = express();

// Middleware setup
app.use(logger("dev")); // Logger middleware for development
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory

// Route handlers
app.use("/", indexRouter); // Route for the index page
app.use("/test", testRoute); // Route for user-related operations
app.use("/api/auth", authRoute); // Route for authentication-related operations
app.use("/api/movies", movieRoute); // Route for movie-related operations
app.use("/api/watchlist", watchlistRoute); // Route for watchlist-related operations

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DB_URL);

// Export the app module
module.exports = app;

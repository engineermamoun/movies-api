const mongoose = require("mongoose");

// Define the schema for the User model
const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // User name is required
      maxlength: 50, // Maximum length for the name is 50 characters
    },
    email: {
      type: String,
      required: true, // User email is required
      unique: true, // Email must be unique
    },
    password: {
      type: String,
      required: true, // User password is required
    },
    watchList: [
      {
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie", // Reference to the Movie model
        },
        watched: Boolean, // Indicates if the movie has been watched
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false, // Default value for isAdmin is false
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the User model from the schema
const Model = mongoose.model("User", ModelSchema);

// Export the User model
module.exports = Model;

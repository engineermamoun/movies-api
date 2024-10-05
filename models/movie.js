const mongoose = require("mongoose");

// Define the schema for the Movie model
const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Movie name is required
    },
    category: {
      type: String,
      required: true, // Movie category is required
    },
    description: {
      type: String,
      required: true, // Movie description is required
    },
    rate: {
      type: Number,
      default: 0, // Default rating is 0
    },
    review: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
          },
          comment: String, // Review comment
          rate: Number, // Review rating
        },
      ],
      default: [], // Default is an empty array
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Customize the JSON output of the schema
ModelSchema.set("toJSON", {
  virtuals: true, // Include virtuals in the JSON output
  versionKey: false, // Remove the version key from the JSON output
  transform: (doc, ret) => {
    delete ret._id; // Remove the _id field from the JSON output
  },
});

// Create the Movie model from the schema
const Model = mongoose.model("Movie", ModelSchema);

// Export the Movie model
module.exports = Model;

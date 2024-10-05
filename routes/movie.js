const express = require("express");
const router = express.Router();
const controller = require("../controllers/moviesContorller");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// Route to create a new movie, accessible only by authenticated admins
router.post("/", [auth.check, admin.check], controller.create);

// Route to delete a movie by ID, accessible only by authenticated admins
router.delete("/:id", [auth.check, admin.check], controller.delete);

// Route to update a movie by ID, accessible only by authenticated admins
router.put("/:id", [auth.check, admin.check], controller.update);

// Route to get a movie by ID, accessible only by authenticated users
router.get("/:id", auth.check, controller.find);

// Route to get all movies, accessible only by authenticated users
router.get("/", auth.check, controller.list);

// Route to add a review to a movie by ID, accessible only by authenticated users
router.post("/:id/reviews", auth.check, controller.addReview);

// Route to get all reviews for a movie by ID
router.get("/:id/reviews", controller.reviews);

module.exports = router;

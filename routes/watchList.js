const express = require("express");
const router = express.Router();
const controller = require("../controllers/watchListController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// Route to add a movie to the watchlist, accessible only by authenticated admins
router.post("/", [auth.check, admin.check], controller.add);

// Route to delete a movie from the watchlist, accessible only by authenticated admins
router.delete("/:movie", [auth.check, admin.check], controller.delete);

// Route to list all movies in the watchlist, accessible only by authenticated users
router.get("/", auth.check, controller.list);

module.exports = router;


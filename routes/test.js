const express = require('express');
const router = express.Router();

/* GET Route. */
// Route to test the routes functinality
router.get('/', function(req, res, next) {
  res.send('respond with a resource'); // Respond with a placeholder message
});

module.exports = router;

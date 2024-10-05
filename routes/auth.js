const express = require('express');
const router = express.Router();
const controllers = require('../controllers/authContorller');
const auth = require('../middlewares/auth');

// Route to handle user login
router.post('/login', controllers.login);

// Route to handle user registration
router.post('/register', controllers.register);

// Route to get the authenticated user's details, accessible only by authenticated users
router.get('/me', auth.check, controllers.me);

module.exports = router;


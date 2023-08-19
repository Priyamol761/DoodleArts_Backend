const express = require('express');
const router = express.Router();
const controller = require('../controller/loginController');

// Define the POST route for login
router.post('/login', controller.login);


module.exports = router;
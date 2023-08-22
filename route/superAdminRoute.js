const express = require('express');
const router = express.Router();
const controller = require('../controller/superAdminController');

// Define the POST route for creating data
router.post('/addsuperadmin', controller.addSuperAdmin);

module.exports = router;
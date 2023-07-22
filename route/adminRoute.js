const express = require('express');
const router = express.Router();
const { createData } = require('../controller/adminController');

// Define the POST route for creating data
router.post('/data', createData);

module.exports = router;
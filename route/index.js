const express = require('express');
const router = express.Router();

// Import all the individual route files
const adminRoute = require('./adminRoute');


// Use the individual routes
router.use('/admin', adminRoute);


module.exports = router;

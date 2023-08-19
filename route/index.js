const express = require('express');
const router = express.Router();

// Import all the individual route files
const loginRoute = require('./loginRoute');
const adminRoute = require('./adminRoute');


// Use the individual routes
router.use('/admin', adminRoute);

router.use('/user', loginRoute);


module.exports = router;

const express = require('express');
const router = express.Router();

// Import all the individual route files
const loginRoute = require('./loginRoute');
const superAdminRoute = require('./superAdminRoute')
const adminRoute = require('./adminRoute');


// Use the individual routes
router.use('/admin', adminRoute);

router.use('/user', loginRoute);

router.use('/superuser', superAdminRoute);

module.exports = router;

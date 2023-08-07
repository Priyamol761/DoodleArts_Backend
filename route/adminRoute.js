const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController');

// Define the POST route for creating data
router.post('/addadmin', controller.addUser);

router.get('/getalladmin', controller.getAllAdmin);

router.get('/getadmin/:email', controller.getAdminByEmail);

router.patch('/updateadmin/:email', controller.updateAdminByEmail);

router.delete('/deleteadmin/:email', controller.deleteAdminByEmail);

module.exports = router;
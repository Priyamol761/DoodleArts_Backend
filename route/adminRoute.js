const express = require('express');
const router = express.Router();
const controller = require('../controller/adminController');

// Define the POST route for creating data
router.post('/adduser', controller.addUser);

router.get('/getalluser/:role', controller.getAllUser);

router.get('/getuser/email/:email', controller.getAdminByEmail);

router.get('/getuser/uuid/:uuid', controller.getAdminByUUID);

router.patch('/updateuser/email/:email', controller.updateAdminByEmail);

router.patch('/updateuser/uuid/:uuid', controller.updateAdminByUUID);

router.delete('/deleteuser/email/:email', controller.deleteAdminByEmail);

router.delete('/deleteuser/uuid/:uuid', controller.deleteAdminByUUID);

module.exports = router;
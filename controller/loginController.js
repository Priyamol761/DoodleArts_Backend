const { admin, db } = require('../firebase');
const {loginSchema} = require('../schema/loginSchema');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');



module.exports.login = async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Extract login credentials from the request body
      const { email, password } = req.body;
  
      // Retrieve user data based on email
      const dataRef = db.collection('adminCollection');
      const adminDetails = await dataRef.where('email', '==', email).get();
  
      if (adminDetails.empty) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract hashed password from retrieved data
      const userData = adminDetails.docs[0].data();
      const hashedPassword = userData.password;
  
      // Compare input password with stored hashed password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
      if (passwordMatch) {
        // Passwords match, user is logged in
        return res.status(200).json({ message: 'Login successful' });
      } else {
        // Passwords do not match, login failed
        return res.status(401).json({ error: 'Login failed' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
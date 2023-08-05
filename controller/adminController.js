const admin = require('firebase-admin');
const adminSchema = require('../schema/adminSchema');

// Initialize Firebase Admin SDK using the service account JSON
const serviceAccount = require('C:\\Users\\priya\\DoodleArts_Backend\\serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports.addUser = async (req, res) => {
  try {
    // Validate the request data against the schema
    console.log(" Add Admin Testing")
    const { error } = adminSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Store the data in Firebase Firestore
    const dataRef = db.collection('adminCollection');
    const docRef = await dataRef.add(req.body);
    console.log("User Details");
    console.log(docRef);
    console.log(req.body);
    
    const allData = [];
    docRef.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() });
    });

    return res.status(201).json(allData);
  } catch (error) {
    console.error('Error creating data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.getAllAdmin = async (req, res) => {
  try {
    // Retrieve all data from the adminCollection
    const dataRef = db.collection('adminCollection');
    console.log(" get all Admin Testing")
    const dataList = await dataRef.where('role', '==', 'admin').get();
    console.log("Data List in Get All User")
    console.log(dataList);

    // Extract data from the dataList and convert to an array of objects
    const allData = [];
    dataList.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(allData);
  } catch (error) {
    console.error('Error getting data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.getAdminByEmail = async (req, res) => {
  try {
    // Extract the email from the request query parameter
    console.log(" get one Admin Testing")
    const { email } = req.query;

    // Retrieve data from the adminCollection based on the email_id filter
    const dataRef = db.collection('adminCollection');
    const adminDetails = await dataRef.where('email', '==', email).get();

    // Check if any data is found
    if (adminDetails.empty) {
      return res.status(404).json({ error: 'No data found for the given email' });
    }

    // Extract data from the adminDetails and convert to an array of objects
    const allData = [];
    adminDetails.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(allData);
  } catch (error) {
    console.error('Error getting data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.updateAdminByEmail = async (req, res) => {
  try {
    console.log(" get updated Admin Testing")
    // Extract the email from the request parameters
    const { email } = req.body;

    // Update the data in Firebase Firestore
    const dataRef = db.collection('adminCollection');
    const dataList = await dataRef.where('email', '==', email).get();

    const allData = [];
    dataList.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() });
    });

    if (dataList.empty) {
      return res.status(404).json({ error: 'No data found for the given email' });
    }

    const docRef = dataList.docs[0]; // Assuming there's only one document per email

    // Merge the existing data with the updated data
    const updatedData = { ...docRef.data(), ...req.body };

    // Perform the update
    await docRef.ref.set(updatedData, { merge: true });

    return res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.deleteAdminByEmail = async (req, res) => {
  try {
    // Extract the email from the request parameters
    console.log(" delete Admin Testing")
    const { email } = req.body;

    // Delete the data in Firebase Firestore
    const dataRef = db.collection('adminCollection');
    const dataList = await dataRef.where('email', '==', email).get();

    if (dataList.empty) {
      return res.status(404).json({ error: 'No data found for the given email' });
    }

    const docRef = dataList.docs[0]; // Assuming there's only one document per email

    // Perform the delete
    await docRef.ref.delete();

    return res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

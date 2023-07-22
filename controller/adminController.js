const admin = require('firebase-admin');
const dataSchema = require('../schema/adminSchema');

// Initialize Firebase Admin SDK using the service account JSON
const serviceAccount = require('C:\\Users\\priya\\DoodleArts_Backend\\serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createData(req, res) {
  try {
    // Validate the request data against the schema
    console.log("Testing")
    const { error } = dataSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Store the data in Firebase Firestore
    const { title, description } = req.body;
    const dataRef = db.collection('data');
    const docRef = await dataRef.add({
      title,
      description,
    });

    return res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Error creating data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createData,
};
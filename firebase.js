const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using the service account JSON
const serviceAccount = require('./serviceAccountKey.json'); // Adjust the path accordingly
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db }; // Export admin and db for use in other modules

const { admin, db } = require('../firebase');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { addSuperAdminSchema } = require('../schema/superAdminSchema');

// Function to check if an email exists in the database
async function checkEmailExistence(email) {
    const dataRef = db.collection('adminCollection');
    const snapshot = await dataRef.where('email', '==', email).get();
    return !snapshot.empty;
}

module.exports.addSuperAdmin = async (req, res) => {
    try {
        // Validate the request data against the schema
        console.log(" Add Super Admin Testing")

        const body = {
            dob: "07/06/2001",
            email: "priyamol761@gmail.com",
            firstname: "Admin",
            gender: "Female",
            lastname: "Admin",
            password: "D00dl3@rts",
            phonenumber: "8680812838",
            role: "superadmin"
        }

        const { error } = addSuperAdminSchema.validate(body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the email already exists in the database
        const existingUser = await checkEmailExistence(body.email);
        if (existingUser) {
            return res.status(200).json({ message: 'Email already exists' });
        }

        const uuid = uuidv4();
        const userDataWithUUID = { ...body, uuid: uuid }; // Add UUID to the data

        // Hash the password
        const saltRounds = 9; // You can adjust this according to your security needs
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);
        userDataWithUUID.password = hashedPassword;

        // Store the data in Firebase Firestore
        const dataRef = db.collection('adminCollection');
        const docRef = await dataRef.add(userDataWithUUID);
        console.log(docRef);
        console.log(body);

        const addedDocument = await docRef.get();
        const addedDataWithId = {
            id: addedDocument.id,
            ...addedDocument.data(),
        };
        return res.status(201).json(addedDataWithId);
    } catch (error) {
        console.error('Error creating data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
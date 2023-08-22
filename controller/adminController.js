const { admin, db } = require('../firebase');
const { addUserSchema, getUserByEmailSchema, getUserByUUIDSchema, updateUserByEmailSchemaQuery, updateUserByEmailSchemaBody, updateUserByUUIDSchemaQuery, updateUserByUUIDSchemaBody, getUserByRoleSchema, deleteUserByEmailSchema, deleteUserByUUIDSchema } = require('../schema/adminSchema');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Function to check if an email exists in the database
async function checkEmailExistence(email) {
  const dataRef = db.collection('adminCollection');
  const snapshot = await dataRef.where('email', '==', email).get();
  return !snapshot.empty;
}

module.exports.addUser = async (req, res) => {
  try {
    // Validate the request data against the schema
    console.log(" Add Admin Testing")
    const { error } = addUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the email already exists in the database
    const existingUser = await checkEmailExistence(req.body.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const uuid = uuidv4();
    const userDataWithUUID = { ...req.body, uuid: uuid }; // Add UUID to the data

    // Hash the password
    const saltRounds = 9; // You can adjust this according to your security needs
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    userDataWithUUID.password = hashedPassword;

    // Store the data in Firebase Firestore
    const dataRef = db.collection('adminCollection');
    const docRef = await dataRef.add(userDataWithUUID);
    console.log("User Details");
    console.log(docRef);
    console.log(req.body);

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

module.exports.getAllUser = async (req, res) => {
  try {
    // Retrieve all data from the adminCollection
    const dataRef = db.collection('adminCollection');
    console.log(" get all Admin Testing")

    const { error } = getUserByRoleSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { role } = req.params;
    let dataList;
    if (role === "all") {
      dataList = await dataRef.get();
    } else {
      dataList = await dataRef.where('role', '==', role).get();
    }
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
    // Extract the email from the request params parameter
    console.log(" get one Admin Testing")

    const { error } = getUserByEmailSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.params;

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

module.exports.getAdminByUUID = async (req, res) => {
  try {
    // Extract the email from the request params; parameter
    console.log(" get one Admin Testing")

    const { error } = getUserByUUIDSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { uuid } = req.params;

    // Retrieve data from the adminCollection based on the email_id filter
    const dataRef = db.collection('adminCollection');
    const adminDetails = await dataRef.where('uuid', '==', uuid).get();

    // Check if any data is found
    if (adminDetails.empty) {
      return res.status(404).json({ error: 'No data found for the given uuid' });
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

    const { error: paramsError } = updateUserByEmailSchemaQuery.validate(req.params);
    if (paramsError) {
      return res.status(400).json({ error: paramsError.details[0].message });
    }

    // Extract the email from the request parameters
    const { email } = req.params;

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

    const { error: bodyError } = updateUserByEmailSchemaBody.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ error: bodyError.details[0].message });
    }


    let newemail;
    if (req.body.email !== undefined && req.body.email !== null) {
      newemail = req.body.email;
    

    // Check if the new email already exists in the collection
    const emailExistsQuery = await db.collection('adminCollection').where('email', '==', newemail).get();

    if (!emailExistsQuery.empty) {
      return res.status(400).json({ error: 'Email already exists in the collection' });
    }
  }

    const docRef = dataList.docs[0]; // Assuming there's only one document per email

    // Merge the existing data with the updated data
    const updatedData = { ...docRef.data(), ...req.body };

    // Perform the update with ignoreUndefinedProperties option
    await docRef.ref.set(updatedData, { merge: true, ignoreUndefinedProperties: true });


    return res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.updateAdminByUUID = async (req, res) => {
  try {
    console.log(" get updated Admin Testing")

    const { error: paramsError } = updateUserByUUIDSchemaQuery.validate(req.params);
    if (paramsError) {
      return res.status(400).json({ error: paramsError.details[0].message });
    }

    // Extract the email from the request parameters
    const { uuid } = req.params;

    // Update the data in Firebase Firestore
    const dataRef = db.collection('adminCollection');
    const dataList = await dataRef.where('uuid', '==', uuid).get();

    const allData = [];
    dataList.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() });
    });

    if (dataList.empty) {
      return res.status(404).json({ error: 'No data found for the given uuid' });
    }

    const { error: bodyError } = updateUserByUUIDSchemaBody.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ error: bodyError.details[0].message });
    }

    let email;
    if (req.body.email !== undefined && req.body.email !== null) {
      email = req.body.email; // Assuming email is the field you want to update
    
    // Check if the new email already exists in the collection
    const emailExistsQuery = await db.collection('adminCollection').where('email', '==', email).get();

    if (!emailExistsQuery.empty) {
      return res.status(400).json({ error: 'Email already exists in the collection' });
    }
  }

    const docRef = dataList.docs[0]; // Assuming there's only one document per uuid

    // Merge the existing data with the updated data
    const updatedData = { ...docRef.data(), ...req.body };

    // Perform the update with ignoreUndefinedProperties option
    await docRef.ref.set(updatedData, { merge: true, ignoreUndefinedProperties: true });


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
    const { error } = deleteUserByEmailSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.params;

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

module.exports.deleteAdminByUUID = async (req, res) => {
  try {
    // Extract the email from the request parameters
    console.log(" delete Admin Testing")
    const { error } = deleteUserByUUIDSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { uuid } = req.params;

    // Delete the data in Firebase Firestore
    const dataRef = db.collection('adminCollection');
    const dataList = await dataRef.where('uuid', '==', uuid).get();

    if (dataList.empty) {
      return res.status(404).json({ error: 'No data found for the given uuid' });
    }

    const docRef = dataList.docs[0]; // Assuming there's only one document per uuid

    // Perform the delete
    await docRef.ref.delete();

    return res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';
const dbName = 'tinyapp';

// MongoDB is used to store data
async function connect() {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  return db;
}

// Function to get users from the users collection
async function getUsers() {
  const db = await connect();
  const users = await db.collection('users').find({}).toArray();
  return users;
}

// Function to get a specific user by their ID
async function getUserById(id) {
  const db = await connect();
  const user = await db.collection('users').findOne({_id: ObjectID(id)});
  return user;
}

async function getUserByEmail(email) {
  const db = await connect();
  const user = await db.collection('users').findOne({ email: email });
  return user;
}


// Function to create a new user in the database
async function createUser(email, password) {
  const db = await connect();
  const hashedPassword = hashPassword(password, 10);
  const result = await db.collection('users').insertOne({email: email, password: hashedPassword});
  const user = await getUserById(result.insertedId);
  return user;
}

// Export the functions for use in other files
module.exports = { getUsers, getUserById, createUser, getUserByEmail };


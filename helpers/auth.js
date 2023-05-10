const bcrypt = require('bcrypt');
const dataHelpers = require('./data');
const { getUsers, getUserById, createUser } = require('./data')
const { getUserByEmail, urlsForUser, generateRandomString, hashPassword } = require('./helpers');


// Authenticate user with email and password
const authenticateUser = function(email, password, callback) {
  dataHelpers.getUserByEmail(email).then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      callback(null, user);
    } else {
      callback("Invalid email or password", null);
    }
  }).catch(err => {
    callback(err, null);
  });
};

// Export the helper functions
module.exports = { authenticateUser };

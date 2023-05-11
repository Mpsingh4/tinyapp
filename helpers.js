const bcrypt = require('bcrypt');

// Return a user object based on their email
const getUserByEmail = function(email, users) {
  for (let userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// Return an object containing only the urls owned by the user
const urlsForUser = function(id, urlDatabase) {
  const userUrls = {};
  for (let shortUrl in urlDatabase) {
    const url = urlDatabase[shortUrl];
    if (url.userId === id) {
      userUrls[shortUrl] = url;
    }
  }
  return userUrls;
};

// Generate a string of 6 random alphanumeric characters
const generateRandomString = function() {
  let randomString = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomString;
};

// Hash is a given password using bcrypt
const hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};


// Export the helper functions
module.exports = { getUserByEmail, urlsForUser, generateRandomString, hashPassword };

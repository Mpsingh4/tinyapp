const bcrypt = require('bcrypt');

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "blue-gorilla",
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// Generates a random string of specified length
function generateRandomString(length) {
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let stringResult = '';
  for (let i = 0; i < length; i++) {
    let random = Math.floor(Math.random() * characters.length);
    stringResult += characters[random];
  }
  return stringResult;
};



// Gets user object by email
const getUserbyEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined; //return null;
};

// Checks if user exists by email
const existingUsers = function(email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
};

// Example users and URLs database


// Returns URLs for a given user ID
const urlsForUser = function(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

// Authenticates user using email and password
const authenticateUser = function(email, password) {
  // getUserByEmail(email).then(user => {
  //   if (user && bcrypt.compareSync(password, user.password)) {
  //     return user;
  //   }
  //   return null;
  // }).catch(err => {
  //   console.log(err);
  // });
  const userFound = getUserbyEmail(email);

  if (!userFound) {
    return null;
  }

  const isPassMatch = bcrypt.compareSync(password, userFound.password);

  if (!isPassMatch) {
    return "incorrect password"
  } 

  return userFound;

};

// Checks if a given URL exists
// function checkURL(url) {
//   http.get(url, (res) => {
//     if (res.statusCode === 200) {
//       console.log(`${url} exists`);
//     } else {
//       console.log(`${url} does not exist`);
//     }
//   }).on('error', (err) => {
//     console.log(`${url} does not exist`);
//   });
// }

// Hash is a given password using bcrypt
const hashPassword = function(password) {
  return bcrypt.hashSync(password, 10);
};

// Exports all the functions
module.exports = { 
  generateRandomString, 
  getUserbyEmail, 
  existingUsers,  
  urlsForUser, 
  authenticateUser, 
  urlDatabase,
  users,
  hashPassword,
};

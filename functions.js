function generateRandomString(input) {
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let stringResult = '';
  for (let i = 0; i < input; i++) {
   let random = Math.floor(Math.random() * characters.length);
    stringResult += characters[random];
  }
  return stringResult;
};

const getUserbyEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined; //return null;
};


const existingUsers = function(email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
};

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

function urlsForUser(id) {
  const items = {};
  for (let items in urlDatabase) {
    if (urlDatabase[items].userID === id) {
      items[url] = urlDatabase[url];
    }
  }
  return items;
};

const authenticateUser = function(email, password) {
  dataHelpers.getUserByEmail(email).then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }).catch(err => {
    console.log(err);
  });
};


module.exports = { generateRandomString, getUserbyEmail, existingUsers, users, urlDatabase, urlsForUser, authenticateUser };
const express = require('express');
const app = express();
const PORT = 8080; // this will be our default
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const existingUsers = function(email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return true;
    }
  }
  return false;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello to my first server!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {  // to catch errors
  const user = users[req.cookies['user_id']];
  const templateVars = {
    user: user
  }
  res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { 
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: user
  }
  res.render('urls_show', templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { 
    user: user
  }
  res.render('register', templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies['user_id']];
  const templateVars = { 
    urls: urlDatabase,
    user: user
  }
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  // Check if the URL is valid
  try {
    new URL(longURL);
  } catch (err) {
    return res.status(400).send("Invalid URL");
  }
  // Generate a random short URL and add it to the database
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;
  // Redirect to the page that displays the new short URL
  res.redirect(`/urls/${shortURL}`);
});

app.post("/register", (req, res) => {
  const userEmail = req.body.email;
  const userPass = req.body.password;

  if (!(userEmail && userPass)) {
    res.status(400).send('Please use a valid email and password or sign up');
    return;
  }

  if (existingUsers(userEmail)) {
    res.status(400).send('Account already exists');
    return;
  }

  const newUserId = generateRandomString(6);
  users[newUserId] = {
    id: newUserId,
    email: userEmail,
    password: userPass
  };
  res.cookie('user_id', newUserId);
  res.redirect("/login");
});

const newUserEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
};

app.post("/login", (req, res) => {
  res.cookie('user_id', req.body.username); // there was an accidental capital "U" that stopped the code from working.
  const email = req.body.email;
  const password = req.body.password;
  const user = newUserEmail(email);

  if (!user) {
    res.status(400).send("User does not exist.");
    return;
  }

  if (user.password !== password) {
    res.status(400).send("Incorrect Password.");
    return;
  }

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL; //edit function post
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}.`);
});

function generateRandomString(input) {
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let stringResult = '';
  for (let i = 0; i < input; i++) {
   let random = Math.floor(Math.random() * characters.length);
    stringResult += characters[random];
  }
  return stringResult;
};
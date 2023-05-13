const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const PORT = 8080; // This PORT will be our default
const cookieSession = require('cookie-session');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers, urlsForUser, checkURL, hashPassword, authenticateUser } = require('./functions');
const { authenticate } = require('passport');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


// Get routes:

// Homepage
app.get('/', (req, res) => {
  res.send("Hello to my first server!");
});

// Endpoint to retrieve the urlDatabase in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Hello route to test HTML response
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Render the new URL page
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect('/login');
    return;
  }
  const templateVars = {
    user: user
  }
  res.render('urls_new', templateVars);
});

// Show a specific URL details
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  
  if (!userID) {
    return res.status(400).send('Please log in to continue.');
  }
  
  const user = users[userID];
  const shortID = req.params.id;
  const url = urlDatabase[shortID];

  if (url.userID !== userID)  {
    return res.status(400).send('URL does not belong to you');
  }

  const templateVars = { 
    id: shortID,
    longURL: url.longURL,
    user,
  }
  res.render('urls_show', templateVars);
});

// Redirect to the long URL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

// Render the login page
app.get("/login", (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
});

// Render the registration page
app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = { 
    user: undefined,
  }
  res.render('register', templateVars);
});

// Render the URLs index page
app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];

  if (!user) {
    return res.redirect('/login');
  }

  const templateVars = { 
    user,
    urlDatabase: urlsForUser(user.id),
  }
  res.render('urls_index', templateVars);
});

// Check if a URL is valid and exists
app.get('/urls/check-url/:url', async (req, res) => {
  const url = decodeURIComponent(req.params.url);

  try {
    const response = await fetch(url);
    if (response.status === 200) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.sendStatus(404);
  }
});

// POST Routes

// Handle the creation of a new URL. If the user is logged in, it generates a random short URL.
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(400).send('Please log in to continue.');
  }

  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);

  return res.status(400).send("URL does not exist");
});

// Handles the user registration process. If all validations pass, it generates a new user ID and hashes the password.
app.post("/register", (req, res) => {                          
  const userEmail = req.body.email;
  const userPass = req.body.password;

  if (!userEmail || !userPass) {
    res.status(400).send('Please use a valid email and password or sign up');
    return;
  }

  if (getUserbyEmail(userEmail)) {
    res.status(400).send('Account already exists');
    return;
  }

  const userHashedPass = hashPassword(userPass);

  const newUserId = generateRandomString(6);
  users[newUserId] = {
    id: newUserId,
    email: userEmail,
    password: userHashedPass
  };
  req.session.user_id = newUserId;
  res.redirect("/urls");
});

// Handles login process. If the credentials are correct, the session is saved under the user's ID.
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    const errorMessage = `Enter email or password`;
    return res.status(400).send(errorMessage);
  }
  const user = authenticateUser(email, password);

  if (user === 'incorrect password') {
    return res.status(400).send('incorrect password');
  }

  req.session.user_id = user.id; 
  res.redirect("/urls");
});

// Handles the logout process 
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  urlDatabase[req.params.id] = {longURL, userID}
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}.`);
});
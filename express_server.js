const express = require('express');
const app = express();
const PORT = 8080; // this will be our default
const cookieParser = require('cookie-parser');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers } = require('./functions');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


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
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserbyEmail(email);

  if (!user) {
    res.render("login", { message: "User does not exist." });
    return;
  }

  if (user.password !== password) {
    res.render("login", { message: "Incorrect password." });
    return;
  }

  res.cookie("user_id", user);
  res.cookie('user_id', req.body.user_id)
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
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

const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const PORT = 8080; // this will be our default
const cookieSession = require('cookie-session');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers, urlsForUser } = require('./functions');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession());


app.get('/', (req, res) => {
  res.send("Hello to my first server!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {  //             CREATE NEW
  const user = users[req.cookies['user_id']];
  const templateVars = {
    user: user
  }
  res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {//              :ID / SHOW
  const user = users[req.cookies['user_id']];
  const url = urlDatabase[req.params.id];

  if (!user) {
    return res.status(400).send('Please log in to continue.');
  }

  const templateVars = { 
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: user
  }
  res.render('urls_show', templateVars);
});

app.get("/u/:id", (req, res) => {//                    :ID
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.get("/login", (req, res) => {//                  LOGIN
  const user = users[req.cookies['user_id']];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
});

app.get("/register", (req, res) => {//                 REGISTER
  const user = users[req.cookies['user_id']];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = { 
    user: user
  }
  res.render('register', templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies['user_id']];
  // const urls = users ? urlsForUser(users) : {}; --------xx
  const templateVars = { 
    urls: urlDatabase,
    user: user,
    urlDatabase: urlDatabase
  }
  res.render('urls_index', templateVars);
});


// APP POSTS
// APP POSTS
// APP POSTS
// APP POSTS
// APP POSTS
// APP POSTS

app.post("/urls", (req, res) => {//                           CREATED
  const longURL = req.body.longURL;
  // const user = users[req.cookies['user_id']];
  // if (!user) {
  //   return res.status(400).send('Please log in to continue.');
  // }
  try {
    new URL(longURL);
  } catch (err) {
    return res.status(400).send("Invalid URL");
  }
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// let userPass = await bcrypt.hash(req.body.password, 10);
app.post("/register", (req, res) => {//                            REGISTER
  const userPass = bcrypt.hashSync(req.body.password, 10);
  const userEmail = req.body.email;
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

app.post("/login", (req, res) => {//                                    LOGIN
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserbyEmail(email);

  if (!(user && bcrypt.compareSync(password, user.password))) {
    const errorMessage = `Wrong email or password for email: ${email}`;
    return res.status(400).send(errorMessage);
  }
  
  res.cookie("user_id", user);
  res.cookie('user_id', req.body.user_id)
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {//                                      LOGOUT
  res.clearCookie('user_id');
  res.clearCookie('shortURL');
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
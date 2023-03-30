const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const PORT = 8080; // this will be our default
const cookieSession = require('cookie-session');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers, urlsForUser } = require('./functions');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


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
  const user = users[req.session.userId];
  const templateVars = {
    user: user
  }
  res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {//              :ID / SHOW
  const user = users[req.session.userId];
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
  const user = users[req.session.userId];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
});

app.get("/register", (req, res) => {//                 REGISTER
  // const user = users[req.cookies['user_id']];
  const user = users[req.session.userId]
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = { 
    user: user
  }
  res.render('register', templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.session.userId];
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
  const user = users[req.session.userId];
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
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies};
  res.redirect(`/urls/${shortURL}`);
});


app.post("/register", (req, res) => {
  const userPass = bcrypt.hashSync(req.body.password, 10);
  const userEmail = req.body.email;
  if (!(userEmail && userPass)) {
    return res.status(400).send("Please enter a valid email and password");
  } else if (existingUsers(userEmail)) {
    return res.status(400).send("User already exists");
  } else {
    const userId = generateRandomString(6);
    users[userId] = {
      id: userId,
      email: userEmail,
      password: userPass
    };
    req.session.user_id = userId;
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {//                                    LOGIN
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserbyEmail(email);

  if (!(user && bcrypt.compareSync(password, user.password))) {
    const errorMessage = `Wrong email or password for email: ${email}`;
    return res.status(400).send(errorMessage);
  }
  
  // req.session.userId = newUserId;
  res.cookie('user_id', req.body.user_id)
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {//                                      LOGOUT
  // req.session.userId = newUserId;
  res.clearCookie('user_id');
  res.clearCookie('shortURL');
  res.redirect("/login");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL; //edit function post
  // req.session.userId = newUserId;
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  // req.session.userId = newUserID;
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}.`);
});
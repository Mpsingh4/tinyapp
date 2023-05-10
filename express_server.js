const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const authHelpers = require('./helpers/auth');
const dataHelpers = require('./helpers/data');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers, urlsForUser } = require('./functions');

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(authHelpers.authenticateUser); // see auth.js
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

// Routes
app.get('/', (req, res) => {
  res.send("Hello to my first server!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {  // Renders a page for creating a new short URL
  const user = users[req.cookies['user_id']];
  const templateVars = {
    user: user
  }
  res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {// Renders a page showing the details of a short URL
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

app.get("/u/:id", (req, res) => {// Redirects to the long URL associated with a given short URL
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.get("/login", (req, res) => {// Renders a page for user login
  const user = users[req.cookies['user_id']];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
});

app.get('/register', (req, res) => {// Renders a page for user registration
  res.render('register');
});

app.get("/urls", (req, res) => { // Renders the list of short URLs for the logged in user
  const user = users[req.cookies['user_id']];
  const templateVars = { 
    urls: urlDatabase,
    user: user,
    urlDatabase: urlDatabase
  }
  res.render('urls_index', templateVars);
});


app.post("/urls", (req, res) => {//                           CREATED
  const longURL = req.body.longURL;
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
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).render('register', { message: 'Email and password are required' });
  } else {
    const existingUser = await dataHelpers.getUserByEmail(email);
    if (existingUser) {
      res.status(400).render('register', { message: 'Email already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await dataHelpers.createUser(email, hashedPassword);
      req.session.userId = user._id;
      res.redirect('/urls');
    }
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await dataHelpers.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).render('login', { message: 'Invalid email or password' });
  } else {
    req.session.userId = user._id;
    res.redirect('/urls');
  }
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

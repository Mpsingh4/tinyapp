const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const PORT = 8080; // this will be our default
const cookieSession = require('cookie-session');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers, urlsForUser, checkURL } = require('./functions');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//routes

app.get('/', (req, res) => {
  res.send("Hello to my first server!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

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

app.get("/urls/:id", (req, res) => {//              :ID / SHOW
  const user = users[req.session.user_id];
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
  const user = users[req.session.user_id];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = {
    user: user
  }
  res.render('login', templateVars);
});

app.get("/register", (req, res) => {//                 REGISTER
  const user = users[req.session.user_id];
  if (user) {
    res.redirect('/urls')
  }
  const templateVars = { 
    user: user
  }
  res.render('register', templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];

  if (!user) {
    return res.redirect('/login');
  }

  const templateVars = { 
    urls: urlDatabase,
    user: user,
    urlDatabase: urlDatabase
  }
  res.render('urls_index', templateVars);
});

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

// app.get("/urls", (req, res) => {                  since i tried to implement this i crashed the whole project, even reverting to older
//   const user = users[req.session.user_id];
//   if (!user) {
//     return res.redirect('/login');
//   }
//   const userUrls = urlsForUser(user.id, urlDatabase);
//   const templateVars = { 
//     urls: userUrls,
//     user: user,
//     urlDatabase: urlDatabase
//   };
  
//   // Add a check to make sure the short URL exists in urlDatabase
//   for (const shortURL in userUrls) {
//     if (!urlDatabase[shortURL]) {
//       delete userUrls[shortURL];
//     }
//   }
  
//   templateVars.urls = userUrls;
  
//   res.render('urls_index', templateVars);
// });


app.post("/urls", (req, res) => {// - -------------------------    POST URLS
  const longURL = req.body.longURL;
  const user = users[req.session.user_id];
  if (!user) {
    return res.status(400).send('Please log in to continue.');
  }
  try {
    new URL(longURL);
  } catch (err) {
    return res.status(400).send("Invalid URL");
  }
  checkURL(longURL, function(exists) {
    if (exists) {
      const shortURL = generateRandomString(6);
      urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
      res.redirect(`/urls/${shortURL}`);
    } else {
      return res.status(400).send("URL does not exist");
    }
  });
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
  req.session.user_id = newUserId;
  res.redirect("/urls");
});

app.post("/login", (req, res) => { // ------------------------------ LOGIN
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserbyEmail(email);

  if (!(user && bcrypt.compareSync(password, user.password))) {
    const errorMessage = `Wrong email or password for email: ${email}`;
    return res.status(400).send(errorMessage);
  }

  req.session.user_id = user.id; // set the user_id to the user's id
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {//                             Logout
  req.session = null;
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
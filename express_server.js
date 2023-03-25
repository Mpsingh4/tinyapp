const express = require('express');
const app = express();
const PORT = 8080; // this will be our default
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
}); // linked to file in views urls_index

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}.`);
});

//--------------------------------------

// app.get("/urls-show", (req, res) => {
//   res.render("urls_show", templateVars)
// }) - this isnt the proper syntax

function generateRandomString(input) {
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let stringResult = '';

  for (let i = 0; i < input.length; i++) {
   let random = Math.floor(Math.random() * characters.length);
    stringResult += characters[random];
  }
  return stringResult;
}

// console.log(generateRandomString('asdadadasda'));
# TinyApp URL App for Lighthouse Labs

TinyApp is an application that allows users to shorten URLs. It is built with Express, Node.js, EJS, bcrypt, and cookie-session.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- Express
- EJS
- bcrypt
- cookie-session

### Installing

1. Clone the repository to your local machine: git clone https://github.com/Mpsingh4/tinyapp

2. Change into the project directory: cd tinyapp

3. Install the dependencies: Open terminal or command prompt and run the following commands:
  - npm install
  - npm install express
  - npm install ejs
  - npm install bcrypt
  - npm install cookie-session

4. Start the server: npm start

5. Open your browser and navigate to http://localhost:8080/.

## Features

- Register and login to create and manage your shortened URLs.
- Generate unique shortened URLs for any long URL.
- Edit or delete your own URLs.
- View a list of all your shortened URLs.
- Check the availability and status of a URL.

## Routes

- GET /
- Description: Homepage
- GET /urls.json
- Description: Retrieve the URL database in JSON format
- GET /hello
- Description: Test HTML response
- GET /urls/new
- Description: Render the new URL page
- GET /urls/:id
- Description: Show details of a specific URL
- GET /u/:id
- Description: Redirect to the long URL
- GET /login
- Description: Render the login page
- GET /register
- Description: Render the registration page
- GET /urls
- Description: Render the URLs index page
- GET /urls/check-url/:url
- Description: Check if a URL is valid and exists
- POST /urls
- Description: Create a new URL
- POST /register
- Description: Register a new user
- POST /login
- Description: Log in a user
- POST /logout
- Description: Log out a user
- POST /urls/:id
- Description: Edit a URL
- POST /urls/:id/delete
- Description: Delete a URL

## Authors

`Lighthouse Labs` - [Lighthouse Lab's GitHub Profile](https://github.com/lighthouse-labs/)

`Manpreet Saini` - [Manpreet's GitHub Profile](https://github.com/Mpsingh4/)

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit/) file for details.



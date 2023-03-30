
const { assert } = require('chai');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../app');
const { generateRandomString, getUserbyEmail, urlDatabase, users, existingUsers, urlsForUser } = require('../functions');

describe('generateRandomString', function() {
  it('should return a string with six characters', function() {
    const randomStringLength = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(randomStringLength, expectedOutput);
  });

  it('should not return the same string when called multiple times', function() {
    const randomString1 = generateRandomString();
    const randomString2 = generateRandomString();
    assert.notEqual(randomString1, randomString2);
  });
});

describe('getUserbyEmail', function() {
  it('should return a user with a valid email', function() {
    const user = getUserbyEmail("user1@example.com", users);
    const expectedOutput = {
      id: "user1RandomID",
      email: "user1@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined when no user exists for a given email address', function() {
    const user = getUserbyEmail("pop@quiz.com", users);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('existingUsers', function() {
  it('returns true if an email corresponds to a user in the database', function() {
    const existingEmail = existingUsers("user1@example.com", users);
    const expectedOutput = true;
    assert.equal(existingEmail, expectedOutput);
  });

  it('returns false if email doesnt correspond to a user in the database', function() {
    const nonExistantEmail = existingUsers("fakemail@test.com", users);
    const expectedOutput = false;
    assert.equal(nonExistantEmail, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should only return an object of url information specific to the given user ID', function() {
    const specificUrls = urlsForUser("user1RandomID", urlDatabase);
    const expectedOutput = {
      "bfjqot": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "user1RandomID"
      },
      "htlams": {
        longURL: "http://www.google.com",
        userID: "user1RandomID"
      }
    };
    assert.deepEqual(specificUrls, expectedOutput);
  });

  it('should return an empty object if no urls exist for a given user ID', function() {
    const noSpecificUrl = urlsForUser("fakeUser", urlDatabase);
    const expectedOutput = {};
    assert.deepEqual(noSpecificUrl, expectedOutput);
  });
});

describe('GET /urls', function() {
  it('should return a 200 response', function(done) {
    request(app)
      .get('/urls')
      .expect(200, done);
  });
});

describe('GET /urls/new', function() {
  it('should return a 200 response', function(done) {
    request(app)
      .get('/urls/new')
      .expect(200, done);
  });
});


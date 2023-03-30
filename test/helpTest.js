// Test for functions.js

const { assert } = require('chai');

const { getUserByEmail } = require('../functions');

const testUsers = {
  "user1RandomID": {
    id: "user1RandomID",
    email: "user1@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "blue-gorilla"
  }
};



describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  it('should return undefined if email is not in users database', function() {
    const user = getUserByEmail("userihdihdaoidhoa@example.com", testUsers);
    assert.isUndefined(user);
  });
});
var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      var queryString = "SELECT messages.message, messages.roomname, users.username FROM messages\
        left outer join users on (messages.user = users.id) order by messages.id";
      db.query(queryString, callback);
    },
    post: function (params, callback) {
      console.log(params);
      var queryString = "INSERT INTO messages (message, roomname, user) \
        values (?, ?, (select id from users where username = ? limit 1))";
      db.query(queryString, params, callback);
    }
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      db.query('SELECT username FROM users', [], callback);
    },
    post: function (params, callback) {
      //post the data to our database
      var queryString = "insert into users(username) values (?)";
      db.query(queryString, params, callback);
    }
  }
};

// db.quer

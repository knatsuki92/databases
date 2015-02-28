var db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {

      db.query('SELECT * FROM messages', [], function(err, results) {
        if(err) throw err;
        else {
          res.status(200).end(results);
        }

      });
    }, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

// db.quer

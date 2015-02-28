var db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      db.query("SELECT message, roomname, username FROM messages", [], function(err, results) {
        if(err) {
          throw err;
        }
        else {
          var data = {results: results};
          console.log(data);
          res.status(200).end(JSON.stringify(data));
        }

      });
    }, // a function which produces all the messages
    post: function (req, res) {
      //get data from the request
      var newMessage = req.body;
      //post the data to our database
      var values ="'" +  newMessage.text + "'" +  "," + "'" + newMessage.roomname + "'" + "," + "'" + newMessage.username + "'";

      db.query("INSERT INTO messages\
                (message, roomname, username)\
                values (" + values + ")",
                [],
                function(err, result) {
                  if(err) throw err;
                  else {
                    res.status(201).end();
                  }
                });
      //send a response back to the user with the status code -- successful or not

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (req, res) {
      db.query('SELECT username FROM users', [], function(err, results) {
        if(err) {
          throw err;
        }
        else {
          var data = {results: results};
          console.log(data);
          res.status(200).end(JSON.stringify(data));
        }

      });
    },
    post: function (req, res) {
      var newUser = req.body;
      //post the data to our database
      var values = "'" + newUser.username + "'";
      db.query("INSERT INTO users\
                (username)\
                values ( " + values + ")",
                [],
                function(err, result) {
                  if(err) throw err;
                  else {
                    res.status(201).end();
                  }
                });
    }
  }
};

// db.quer

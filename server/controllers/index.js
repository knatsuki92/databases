var models = require('../models');
var bluebird = require('bluebird');


module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get( function(err, results) {
        if(err) {
          throw err;
        }
        else {
          var data = {results: results};
          console.log(data);
          res.status(200).end(JSON.stringify(data));
        }
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) { // a function which handles posting a message to the database
      var params = [req.body.text, req.body.roomname, req.body.username ];
      models.messages.post(params, function(err, results) {
        if(err) { throw err;
        } else {
          res.status(201).end();
        }
      });
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(err, results) {
        if(err) {
          throw err;
        }
        else {
          var data = {results: results};
          console.log(data);
          res.status(200).end(JSON.stringify(data));
        }
      });
    }, // a function which handles a get request for all users
    post: function (req, res) {
      var params = [req.body.username];
      models.users.post(params, function(err, results) {
        if(err) throw err;
        else {
          res.status(201).end();
        }
      });
    }
  }
};


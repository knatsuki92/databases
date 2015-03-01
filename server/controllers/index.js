var models = require('../models');
var bluebird = require('bluebird');
var db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      db.Message.findAll({include: [db.User]})
        .complete(function(err, results) {
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
      db.User.findOrCreate({where: {username: req.body.username}})
        .complete(function(err, results) {
          db.Message.create({userid: results[0].dataValues.id,
            message: req.body.text,
            roomname: req.body.roomname
          });
        }).complete(function(err, results) {
          if(err) { throw err;
          } else {
            res.status(201).end();
          }
        }
      );
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      db.User.findAll()
        .complete(function(err, results) {
          if(err) {
            throw err;
          }
          else {
            var data = {results: results};
            console.log(data);
            res.status(200).end(JSON.stringify(data));
          }
        }
      );
    }, // a function which handles a get request for all users
    post: function (req, res) {
      db.User.create({username: req.body.username})
        .complete(function(err, results) {
          if(err) throw err;
          else {
            res.status(201).end();
          }
        }
      );
    }
  }
};


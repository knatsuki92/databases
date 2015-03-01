var Sequelize = require('Sequelize');
var orm = new Sequelize('chat', 'root', '');

var User = orm.define('User', {
  username: Sequelize.STRING
});

var Message = orm.define('Message', {
  roomname: Sequelize.STRING,
  message: Sequelize.STRING
});

User.hasMany(Message);
Message.belongsTo(User);

User.sync();
Message.sync();

exports.User = User;
exports.Message = Message;

var app = {};
$(document).ready(function() {
// YOUR CODE HERE:
  app.server = "http://127.0.0.1:3000/classes/messages";
  app.initialLoad = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  app.messages = [];
  app.storedMessages = {};
  app.rooms = [];
  app.username = '';
  app.currentRoom = '';
  app.friends = {};

  app.init = function() {
    app.fetch();
  };

  app.redisplay = function () {
    $('.messages').html('');
    app.displayMessages(app.messages);
  };

  app.send = function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });

  };

  //Display Code
  app.displayMessages = function (messages) {
    var messageContainer = $('.messages');

    // if (app.currentRoom) {
    //   undisplayedMessages = _.filter(undisplayedMessages, function(message) {
    //     return message.roomname === app.currentRoom;
    //   });
    // }
    //

    var undisplayedMessages = _.filter(messages, function(message) {
      return app.storedMessages[message.createdAt] === undefined ? true : false;
    });


    messages.forEach(function(result) {
      app.storedMessages[result.createdAt] = result;
    });


    _.each(undisplayedMessages, function (message) {
      var $user = $('<span class="username"></span>');
      $user.text(message.username);

      var time = message.date;
      var $timestamp = $('<span class="timestamp"></span>');
      // $timestamp.text(time.toLocaleDateString() + ' ' + time.toLocaleTimeString());

      // var $id = $('<span></span>');
      // $id.text(message.objectId);

      var $messageHtml = $('<div class="message-text"></div>');
      $messageHtml.text(message.text).html();

      //add friend-message class to message text div if user is a friend

      if (app.friends[message.username]) {
        $messageHtml.addClass('friend-message');
      }

      var $fullMessage = $('<div class="chat"></div>');
      $fullMessage.append($user);
      // $fullMessage.append($timestamp);
      // $fullMessage.append($id);
      $fullMessage.append($messageHtml);
      messageContainer.prepend($fullMessage);
    });
  };


  app.fetch = function() {
    $.get(app.server, function (response) {
      var results = JSON.parse(response).results;
      console.log(results);
      app.messages = app.messages.concat(results);
      app.displayMessages(results);
      var newRooms = _.pluck(results, 'roomname');
      newRooms = _.filter(newRooms, function (room) {
        return room; //filter undefined and empty string
      });
      app.rooms = _.uniq(app.rooms.concat(newRooms));
      app.updateRooms();
    });
    setTimeout(app.fetch, 60000);
  };

  app.updateRooms = function () {
    var $rooms = $('.rooms');
    $rooms.html('');
    _.each(app.rooms, function (room) {
      var $room = $('<li></li>');
      $room.text(room);
      if (room === app.currentRoom) {
        $room.addClass('current-room');
      }
      $rooms.append($room);
    });
  };

  $('.chat-form').on('submit', function(event) {
    event.preventDefault();
    var $inputText = $('.new-message-text');
    var message = {
      text: $inputText.val(),
      username: app.username,
      roomname: app.currentRoom || undefined
    };
    $inputText.val('');
    app.send(message);
  });


  $('.username-link').on('click', function (event) {
    event.preventDefault();

    $usernameLink = $(this);
    $usernameLink.hide();

    var $container = $('.login-container');
    var $usernameForm = $(
      '<form>' +
      '<input type="text" class="username-input" placeholder="Enter user name"/>' +
      '<button type="submit">Log in</button>' +
      '</form>'
      );

    $container.append($usernameForm);

    $usernameForm.on('submit', function (event) {
      event.preventDefault();
      app.username = $('.username-input').val()
      $(this).remove();
      $usernameLink.text(app.username);
      $usernameLink.show();
    });
  });

  var $rooms = $('.rooms');
  $rooms.on('click', 'li', function(event) {
    event.preventDefault();
    if (app.currentRoom) {
      //remove class from current room
      $('.current-room').removeClass('current-room');
    }
    app.currentRoom = $(this).text();
    $(this).addClass('current-room');
    app.redisplay();
  });

  $('.new-room-form').on('submit', function (event) {
    event.preventDefault();
    app.currentRoom = $('.new-room-name').val();
    $('.new-room-name').val('');
    app.rooms.push(app.currentRoom);
    app.updateRooms();
    app.redisplay();
  });

  $('.messages').on('click', '.username', function (event) {
    event.preventDefault();
    var friend = $(this).text();
    app.friends[friend] = !app.friends[friend];
    app.redisplay();
  });

  $('.home').on('click', function (event) {
    if (app.currentRoom) {
      $('.current-room').removeClass('current-room');
    }
    app.currentRoom = '';
    app.redisplay();
  });

  app.init();
});

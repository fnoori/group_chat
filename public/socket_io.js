let socket = io();
let messages = [];
let users = [];

$(document).on('keypress',function(e) {
  if(e.which == 13) {
      sendMessage();
  }
});

socket.on('connect', function(){
  let ranNum = Math.floor((Math.random() * 10) + 1);
  let usernameIs;
  for (var i = 0; i < 10; i++) {
    ranNum += String(Math.floor((Math.random() * 10) + 1));
  }
  usernameIs = `user${ranNum}`;
  $('#username').text(usernameIs);

  socket.emit('update user', usernameIs);
  socket.emit('update chat', usernameIs);
});

socket.on('update chat', function(messages) {
  $('#messages_list').empty();
  messages.forEach((message) => {
    if ($('#username').text() === message.username.username) {
      $('#messages_list')
      .append($(`<li>
                    <div class="message-time">${message.time}</div>
                    <div class="username-message" style="color: #${message.username.color} !important;"><b>${message.username.username}</b></div>
                    <div class="message-content">${message.message}</div>
                  </li>`));
    } else if (message.username === ' ') {
      $('#messages_list')
      .append($(`<li>
                    <div class="message-time">${message.time}</div>
                    <div class="username-message"></div>
                    <div class="message-content">${message.message}</div>
                  </li>`));
    } else {
      $('#messages_list')
      .append($(`<li>
                    <div class="message-time">${message.time}</div>
                    <div class="username-message" style="color: #${message.username.color} !important;">${message.username.username}</div>
                    <div class="message-content">${message.message}</div>
                  </li>`));
    }

  });

  $("#messages_list").scrollTop($("#messages_list")[0].scrollHeight);
});

socket.on('update user', function(users) {
  $('#user_list').empty();
  users.forEach((user) => {
    $('#user_list').append($(`<li style="color: ${user.color}">${user.username}</li>`));
  });
});

socket.on('chat message', function(msg) {
  if (msg.username.username === $('#username').text()) {
    $('#messages_list')
    .append($(`<li>
                <div class="message-time">${msg.time}</div>
                <div class="username-message" style="color: #${msg.username.color} !important;"><b>${msg.username.username}</b></div>
                <div class="message-content">${msg.message}</div>
              </li>`));
  } else {
    $('#messages_list')
    .append($(`<li>
                <div class="message-time">${msg.time}</div>
                <div class="username-message" style="color: #${msg.username.color} !important;">${msg.username.username}</div>
                <div class="message-content">${msg.message}</div>
              </li>`));
  }

  $("#messages_list").scrollTop($("#messages_list")[0].scrollHeight);
});

function sendMessage() {
  let message = $('#message').val();
  let username = $('#username').text();

  if (message.split(' ')[0] === '/nick') {
    let oldUsername = username;
    let newUsername = message.split(' ')[1];
    let currentListOfUsers = [];

    $('#user_list li').toArray().forEach((user) => {
      if (user.textContent === newUsername) {
        return alert('username is already taken');
      }
    });

    socket.emit('update username', [oldUsername, newUsername]);

    $('#message').val('');
    $('#username').text(newUsername);

  } else if (message.split(' ')[0] === '/nickcolor') {
    let newColor = message.split(' ')[1];

    socket.emit('update username color', [username, newColor]);
    $('#message').val('');

  } else {
    let messageToSend = {
      'username': username,
      'message': message,
      'time': new Date().toLocaleTimeString()
    };

    socket.emit('chat message', messageToSend);
    $('#message').val('');
  }

  return false;
}

function disconnect() {
  let username = $('#username').text();

  socket.emit('user disconnect', username);
  window.location = 'www.google.com';
}

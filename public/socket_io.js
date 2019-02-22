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
    $('#messages_list')
    .append($(`<li>
                  <div class="message-time">${message.time}</div>
                  <div class="username-message">${message.username}</div>
                  <div class="message-content">${message.message}</div>
                </li>`));
  });
});

socket.on('disconnect', function() {
  let userToRemove = $('#username').text();

  socket.emit('remove user', userToRemove);
});

socket.on('update user', function(users) {
  $('#user_list').empty();
  users.forEach((user) => {
    $('#user_list').append($(`<li>${user}</li>`));
  });
});

socket.on('chat message', function(msg) {
  $('#messages_list')
  .append($(`<li>
              <div class="message-time">${msg.time}</div>
              <div class="username-message">${msg.username}</div>
              <div class="message-content">${msg.message}</div>
            </li>`));
  $("#messages_list").scrollTop($("#messages_list")[0].scrollHeight);
});

function sendMessage() {
  let message = $('#message').val();
  let username = $('#username').text();

  if (message.split(' ')[0] === '/nick') {
    let oldUsername = username;
    let newUsername = message.split(' ')[1];

    socket.emit('update username', [oldUsername, newUsername]);

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

function test() {
  console.log('working');
}

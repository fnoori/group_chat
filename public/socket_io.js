let socket = io();
let messages = [];
let users = [];

socket.on('connect', function(){
  let ranNum = Math.floor((Math.random() * 10) + 1);
  let usernameIs;
  for (var i = 0; i < 10; i++) {
    ranNum += String(Math.floor((Math.random() * 10) + 1));
  }
  usernameIs = `user${ranNum}`;
  $('#username').text(usernameIs);

  socket.emit('update user', usernameIs);
  socket.emit('update chat');
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
});

function sendMessage() {
  let message = $('#message').val();
  let username = $('#username').text();
  let messageToSend = {
    'username': username,
    'message': message,
    'time': new Date().toLocaleTimeString()
  };

  socket.emit('chat message', messageToSend);
  $('#message').val('');

  return false;
}

function test() {
  console.log('working');
}

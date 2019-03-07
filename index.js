let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = __dirname + '/views/';

let users = [];
let messages = [];

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/socketio', express.static(__dirname + '/node_modules/socket.io-client/dist/'));

app.get('/', function(req, res){
  res.sendFile(path + 'index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    let incomingMsg = {};

    users.forEach((user) => {
      if ((user.username === msg.username) || (user.username === msg.username.username)) {
        incomingMsg.username = {
          'username': msg.username,
          'color': user.color
        };
      }
    });
    incomingMsg.message = msg.message;
    incomingMsg.time = new Date().toLocaleTimeString();

    console.log('----------------------');
    console.log(users);
    console.log(msg);
    console.log(incomingMsg);
    console.log('----------------------');

    messages.push(incomingMsg);

    io.emit('chat message', incomingMsg);
  });

  socket.on('update chat', function(newUser) {
    if (newUser.length > 0) {
      messages.push({
        'username': ' ',
        'message': `<b>${newUser} just joined</b>`,
        'time': new Date().toLocaleTimeString()
      });
      io.emit('update chat', messages);
    } else {
      io.emit('update chat', messages);
    }
  });

  socket.on('update user', function(user) {
    let newUser = {
      'username': user,
      'color': '#000000'
    };

    users.push(newUser);
    io.emit('update user', users);
  });

  socket.on('update username', function(userInfo) {
    let oldUsername = userInfo[0];
    let newUsername = userInfo[1];
    let indexOfOldUsername = 0;

    users.forEach((user) => {
      if (user === newUsername) {
        io.emit('update user', false);
        return;
      }
    });

    // update username
    users.forEach((user) => {
      if (user.username === oldUsername) {
        user.username = newUsername;
      }
    });

    // update messages
    messages.forEach((message) => {
      if (message.username.username === oldUsername) {
        message.username.username = newUsername;
      }
    });

    io.emit('update chat', messages);
    io.emit('update user', users);
  });

  socket.on('update username color', function(userInfo) {

    users.forEach((user) => {
      if (user.username === userInfo[0]) {
        user.color = userInfo[1];
      }
    });

    messages.forEach((message) => {
      if (message.username.username === userInfo[0]) {
        message['username']['color'] = userInfo[1];
      }
    });

    io.emit('update chat', messages);
    io.emit('update user', users);
  });

  socket.on('user disconnect', function(user) {
    users = users.filter(item => item.username !== user);


    messages.push({
      'username': ' ',
      'message': `<b>${user} left the chat</b>`,
      'time': new Date().toLocaleTimeString()
    });

    io.emit('update chat', messages);
    io.emit('update user', users);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

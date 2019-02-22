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
    messages.push(msg);
    io.emit('chat message', msg);
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
    users.push(user);
    io.emit('update user', users);
  });

  socket.on('update username', function(userInfo) {
    let oldUsername = userInfo[0];
    let newUsername = userInfo[1];
    let indexOfOldUsername = 0;

    users.forEach((user) => {
      if (user === newUsername) {
        io.emit('update username', false);
      }
    });

    // update username
    indexOfOldUsername = users.indexOf(oldUsername);
    users[indexOfOldUsername] = newUsername;

    // update messages
    messages.forEach((message) => {
      if (message.username === oldUsername) {
        message.username = newUsername;
      }
    });

    io.emit('update chat', messages);
    io.emit('update user', users);
  });

  socket.on('remove user', function(user) {
    users.splice(user, 1);
    io.emit('update user', users);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

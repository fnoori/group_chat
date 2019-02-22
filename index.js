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

  socket.on('update chat', function() {
    console.log('inside udpate chat');
    console.log(messages);
    io.emit('update chat', messages);
  });

  socket.on('update user', function(user) {
    users.push(user);
    io.emit('update user', users);
  });

  socket.on('remove user', function(user) {
    users.splice(user, 1);
    console.log(users);
    io.emit('update user', users);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

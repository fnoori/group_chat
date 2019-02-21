let express = require('express');
let app = express();
let http = require('http').Server(app);
let path = __dirname + '/views/';

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(path + 'index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

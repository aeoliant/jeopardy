var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/client/*', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/server', function(req, res){
  res.sendFile(__dirname + '/server.html');
});

app.get('/jeopardy', function(req, res){
  res.sendFile(__dirname + '/single.html');
});

app.get('/final', function(req, res){
  res.sendFile(__dirname + '/final.html');
});

app.use('/static', express.static(__dirname + '/static'));

let players = {};
let next_id = 0;

io.on('connection', function(socket) {
  console.log(socket.id);
  socket.on('newplayer', function(msg, fn) {
    players[next_id] = msg.name;
    fn(next_id);
    next_id++;
    console.dir(players);

    io.emit('playerupdate', players);
  });
  socket.on('ring', function(msg) {
    console.log("ring from "+ msg.id + "!");
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

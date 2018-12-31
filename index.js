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

app.get('/double', function(req, res){
  res.sendFile(__dirname + '/double.html');
});

app.get('/final', function(req, res){
  res.sendFile(__dirname + '/final.html');
});

app.use('/static', express.static(__dirname + '/static'));

let players = {};
let names = {};
let next_id = 0;

io.on('connection', function(socket) {
  console.log(socket.id);
  socket.on('newplayer', function(msg, fn) {
    if (!(msg.name in names)) {
      players[next_id] = msg.name;
      names[msg.name] = next_id;
      fn(next_id);
      next_id++;
    } else {
      fn(names[msg.name]);
    }
    console.dir(players);

    io.emit('playerupdate', players);
  });
  socket.on('ring', function(msg) {
    console.log(microseconds() + " ring from "+ players[msg.id] + "!");
  });
  socket.on('buzzeron', function(msg) {
    io.emit('buzzeron');
    console.log('buzzers on');
  });
  socket.on('buzzeroff', function(msg) {
    io.emit('buzzeroff');
    console.log('buzzers off');
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var start = microsecondsStart();

function microsecondsStart() {
  var hrTime = process.hrtime();
  return ((hrTime[0] * 1000000 + hrTime[1] / 1000)/ 1000);
}

function microseconds() {
  var hrTime = process.hrtime();
  return ((hrTime[0] * 1000000 + hrTime[1] / 1000)/ 1000) - start;
}

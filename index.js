var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/client/*', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/server', function(req, res){
  res.sendFile(__dirname + '/server.html');
});

let players = {};
let next_id = 0;

io.on('connection', function(socket) {
  socket.on('newplayer', function(msg, fn) {
    players[next_id] = msg.name;
    fn(next_id);
    next_id++;
    console.dir(players);

    socket.emit('playerupdate', players);
  });
  socket.on('ring', function(msg) {
    console.log("ring from "+ msg.id + "!");
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

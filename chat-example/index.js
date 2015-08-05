var express = require('express');
var app = express(); // an express framework application
var http = require('http').Server(app);

//make express application to use installed jquery ****
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//Socket.IO is composed of two parts:
//
//    A server that integrates with (or mounts on) the Node.JS HTTP Server: socket.io
//    A client library that loads on the browser side: socket.io-client

//Integrate socket.io to the appication server
var io = require('socket.io')(http);

app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');
  
  //Send the html response, loading a file
  res.sendFile(__dirname + '/index.html');  
});



//Listen on the connection event for incoming sockets, and log it to the console.
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    //Broadcast the message to everybody
    io.emit('chat message', msg);
  });
  socket.on('writing message', function(msg){
    console.log('writing message: ' + msg);
    //Broadcast the message to everybody
    io.emit('writing message', msg);
  });  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
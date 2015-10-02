var express = require('express');
var app = express(); // an express framework application
var http = require('http').Server(app);
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var bodyParser   = require("body-parser");  //midleware neeeded by express in order to support post requests
var parseString  = require('xml2js').parseString ;
var request = require('request');

//make express application to use installed jquery ****
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

//Socket.IO is composed of two parts:
//
//    A server that integrates with (or mounts on) the Node.JS HTTP Server: socket.io
//    A client library that loads on the browser side: socket.io-client

//Integrate socket.io to the appication server
var io = require('socket.io')(http);

var espSatusVar = 0;
app.get('/', function(req, res){
  // res.send('<h1>Hello world</h1>');
  
  //Send the html response, loading a file
  res.sendFile(__dirname + '/index.html');  
});

app.get('/espStatus', function(req, res) {
    res.send( {status:espSatusVar});
});

app.post('/changeEspStatus',function(req,res){
  //console.log("request body "+  JSON.stringify(req.body));
  //console.log(req.body.status)
  espSatusVar=req.body.status;
  res.end("ok new status defined  " + espSatusVar);
});

app.get('/changeEspStatus',function(req,res){
  var query = require('url').parse(req.url,true).query;
  //console.log("request parameter status "+  query.espStatus);
  espSatusVar=query.espStatus;
  res.end("ok new status defined  " + espSatusVar);
});

var webClient = require('./routes/webClient');
app.get('/webClient', webClient.webClient);

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
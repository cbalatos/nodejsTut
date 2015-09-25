var express = require('express');
var app = express(); // an express framework application
var http = require('http').Server(app);
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var parseString  = require('xml2js').parseString ;
var request = require('request');
var fs = require('fs'); //utilities for file system access


//make express application to use installed jquery ****
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//use this for cookies
// must use cookieParser before expressSession
app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere'}));

//Socket.IO is composed of two parts:
//
//    A server that integrates with (or mounts on) the Node.JS HTTP Server: socket.io
//    A client library that loads on the browser side: socket.io-client

//Integrate socket.io to the appication server
var io = require('socket.io')(http);

var dutiesData=[];

app.get('/', function(req, res){

  if (req.session.anErrorHappened ){
  	console.log('Someone came here after an error request');
  	req.session.anErrorHappened = null;
  }
  //Send the html response, loading a file
  res.sendFile(__dirname + '/index.html');  
});

app.get('/chat.html', function(req, res){
  res.send('<h1>You should not be here</h1>');
  
});

app.get('/redirect.html', function(req, res){
  req.session.anErrorHappened = true;
  res.redirect('/');
  
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

//duties api
app.get('/duties', function(req, res){

  res.json(dutiesData);
  
});

//clear duties data
function prepareData(fsaRespone){

  var startPos = fsaRespone.indexOf('<table bordercolor="#9dcea0"');
  if (startPos!= -1){
    tempRespone = fsaRespone.substring(startPos);
    var endPos = tempRespone.indexOf('</table>');
    if (endPos != -1){
      fsaRespone = fsaRespone.slice(startPos, (startPos+endPos+'</table>'.length));
 
      var duties=[];
      while(fsaRespone.indexOf("pharmacyshow.asp")!=-1){
        startPos = fsaRespone.indexOf("pharmacyshow.asp");
        tempRespone = fsaRespone.substring(startPos);
        endPos = tempRespone.indexOf("'");
         if (endPos != -1){
            var urlString = fsaRespone.slice(startPos, (startPos+endPos));
            console.log(urlString)
            duties.push(urlString);
            fsaRespone = fsaRespone.substring(startPos+endPos+1);

         }else{
            fsaRespone = "";
         }
      }
      return duties;
    }else {
      console.log("cannot find end of table")
      return null;
    }

  } else {
    console.log("cannot find start of table")
    return null;
  }
}

function pharmacyData(url, onlyOvernight){
    request('http://www.fsa.gr/'+url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
              var startPos = body.indexOf('<table width="442"');
              var duty=null;
              if (startPos!= -1){
                  tempRespone = body.substring(startPos);
                  var endPos = tempRespone.indexOf('</table>');
                   //console.log("endPos "+ endPos);
                  if (endPos != -1){
                    body = body.slice(startPos, (startPos+endPos+'</table>'.length));
                    body = body.replace('colspan=2', 'colspan="2"').replace(/(\r\n|\n|\r)/gm,"").replace(/\t/g, '');
                    //console.log("Error "+ body)
                    parseString(body, function (err, result) {
                      if(!err && result){
                    
                         duty = {
                            "Kind": result.table["tr"][1]["td"][2]["_"],
                            "Name": result.table["tr"][2]["td"][2]["_"],
                            "Address": result.table["tr"][3]["td"][2]["_"],
                            "Area": result.table["tr"][4]["td"][2]["_"],
                            "Tel": result.table["tr"][5]["td"][2]["_"]
                          };
                          //console.log(JSON.stringify(duty))
                          if (!onlyOvernight || duty["Kind"].indexOf("8 ΠΡΩΙ - 8 ΒΡΑΔΥ") != -1)
                          dutiesData.push(duty);
                      } 
                      if (err)
                        return;
                    });
                  } 
              }
        }
    });
    return null;
  }

  function getDutiesForArea(areaIdString, onlyOvernight){
    request.post(
        'http://www.fsa.gr/duties.asp',
        { form: { prevcat:"2",
                  prevcat1:"70",
                  dateduty:"25/9/2015",
                  areaid:areaIdString,
                  x:"18",
                  y:"7" } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body)

                var dutiesArray = prepareData(response.body);
                if (dutiesArray){
                  console.log("Table is "+ dutiesArray);
                  dutiesArray.forEach(function(pharmacyUrl){
                      var duty = pharmacyData(pharmacyUrl, onlyOvernight);
    
                  })

                }
                else
                  console.log("Problem while parsing");

            }else{
              console.log("error in request: "+ response + " error "+error);
            }
        }
    );
  }

http.listen(3000, function(){

  getDutiesForArea("141",false);            
  getDutiesForArea("142",false); 
  getDutiesForArea("143",false); 
  getDutiesForArea("144",true); 
  getDutiesForArea("157",true); 

  console.log(http.address().address + ' listening on port:' + http.address().port);
});
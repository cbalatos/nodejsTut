exports.lanScanner = function(req, res){
//res.render('webClient', { title: 'Web Client for RSP8266 API' });
 var clientAddress = req.connection.remoteAddress;
 console.log('a request from '+clientAddress);

 res.sendFile(__dirname + '/lanScanner.html');

};
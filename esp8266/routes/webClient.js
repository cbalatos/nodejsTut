exports.webClient = function(req, res){
//res.render('webClient', { title: 'Web Client for RSP8266 API' });
 res.sendFile(__dirname + '/webClient.html');

};
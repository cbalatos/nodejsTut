var http = require('http');

var main = require('./main');

var server = http.createServer(function(req, res) {
	var data = '';
	req
	  .on('data', function(chunk) {
	    data += chunk;
	  })
	  .on('end', function() {
	    console.log('POST data: %s', data);
	  })
	  main.world();
	  res.writeHead(200);
	  res.end(main.message);
});
server.listen(8080);
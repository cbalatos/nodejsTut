
var addition = function(a,b){
	return a+b;
}

exports.message = 'an imported message';
exports.world = function() {
  var a = 3;
  var b = 2
  console.log('Hello World ' + (a+b));
}
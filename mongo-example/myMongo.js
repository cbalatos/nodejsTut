// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
      console.log("We are connected");

      //var collection = db.createCollection('test', {strict:true}, function(err, collection) {}); //Create the collection if it doesn't exist 
    
      var collection = db.collection('test');
      var doc1 = {'hello':'doc1'};
      var doc2 = {'hello':'doc2'};
      var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];
    
      collection.insert(doc1);
    
      collection.insert(doc2, {w:1}, function(err, result) {
      	if(!err){
      		console.log("result is "+ result)
      	}else{
      		console.log("the error is "+ err)
      	}
      }); // {w:1} retrieves the last error status of the connection
    
      collection.insert(lotsOfDocs, {w:1}, function(err, result) {     	if(!err){
      		console.log("result is "+ result)
      	}else{
      		console.log("the error is "+ err)
      	}
      });
      
      //db.close(); Due to asynchronous nature of mongo the sockets will close before actual inserts realy happen
    
  }else{
    console.log("Cannot connect");
    return console.dir("Cannot connect");
  }
});

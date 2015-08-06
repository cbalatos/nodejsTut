// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
  
   // Get the documents collection

    var collection = db.collection('users');
   /* initial collection population
    var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
    var user2 = {name: 'modulus user', age: 22, roles: ['user']};
    var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};

    collection.insert([user1, user2, user3], {w:1}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
    });
    */
 
 collection.update({name: 'modulus user'}, {$set: {enabled: true}}, function (err, numUpdated) {
  if (err) {
    console.log(err);
  } else if (numUpdated) {
    console.log('Updated Successfully %d document(s).', numUpdated);
  } else {
    console.log('No document found with defined "find" criteria!');
  }
  });
  
  //Result sets
  collection.find({name: 'modulus user', age:22}).toArray(function (err, result) { //by default find doesn't fetch the whole resultSet, toArray method forces it
    if (err) {
        console.log(err);
    } else if (result.length) {
        console.log('Found %d results. The result objects are :', result.length, result);
    } else {
        console.log('No document(s) found with defined "find" criteria!');
    }
    //Close connection

  });  

  //Cursor Result Set
  //We have a cursor now with our find criteria
  var cursor = collection.find();

  //We need to sort by age descending
  cursor.sort({age: -1, name:1});

  //Limit to max 10 records
  cursor.limit(10);

  //Skip specified records. 0 for skipping 0 records.
  cursor.skip(0);

  //Lets iterate on the result
  cursor.each(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log('Fetched:', doc);
    }
  });  
  
  }else{
    console.log("Cannot connect");
  }
});

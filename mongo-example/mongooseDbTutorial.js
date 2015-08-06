//Lets load the mongoose module in our program
var mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect('mongodb://localhost:27017/exampleDb');

/**
 * Lets define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
var User = mongoose.model('User', {name: String, roles: Array, age: Number});

/**
 * Lets Use our Models
 * */

User.find({name: 'modulus admin'}).limit(10).exec(function(err, resultSet){

	if (err){
		console.log('error quering the database for users')
	}else{
	console.log(resultSet);
	}
});
User.findOne({name: 'modulus admin'}, function (err, userObj) {
  if (err) {
    console.log(err);
  } else if (userObj) {
    console.log('Found:', userObj);

    //For demo purposes lets update the user on condition.
    if (userObj.age != 30 & userObj.age < 70) {
      //Some demo manipulation
      userObj.age += 30;

      //Lets save it
      userObj.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated', userObj);
        }
      });
    } else if (userObj.age > 70){
    	console.log('The user:'+ userObj.name + ' must die!');
    	userObj.remove(function(err){
          if (err) {
            console.log(err);
          } else {
            console.log('He died');
          } 
        })
    
    }
  } else {
	//Lets create a new user with that name
	var user1 = new User({name: 'modulus admin', age: 25, roles: ['admin', 'moderator', 'user']});

	//Some modifications in user object
	user1.name = user1.name.toUpperCase();

	//Lets try to print and see it. You will see _id is assigned.
	console.log(user1);

	//Lets save it
	user1.save(function (err, userObj) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log('saved successfully:', userObj);
	  }
	  
	});
  }
});
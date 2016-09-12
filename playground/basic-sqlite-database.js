var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined,undefined,undefined, {
	'dialect':'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			len:[1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

//challenge option 1
// sequelize.sync({
// 	//force: true 
// }).then (function(){
// 	console.log('Everything is synced');


// 	//fetch a todo item by id 
// 	//if there print toJSON
// 	//not error todo not found

// 	return Todo.findById(2);

// }).then (function (todo){
// 	if(todo)
// 		console.log(todo.toJSON());
// 	else
// 		console.log('No todo found');
// });


//challenge option 2
sequelize.sync({
	//force: true 
}).then (function(){
	console.log('Everything is synced');

	//fetch a todo item by id 
	//if there print toJSON
	//not error todo not found

	Todo.findById(2).then (function (todo){
		if(todo)
			console.log(todo.toJSON());
		else
			console.log('No todo found');
	});
});


	// Todo.create({
	// 	description: "Walk my dog",
	// }).then(function(todo){
	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	});
	// }).then(function(){
	// 	// return Todo.findById(1);
	// 	return Todo.findAll({
	// 		where: {
	// 			description: {
	// 				$like: '%office%'
	// 			}
	// 		}
	// 	});
	// }).then (function(todos){
	// 	if(todos){
	// 		todos.forEach(function(todo){
	// 			console.log(todo.toJSON());	
	// 		});
			
	// 	} else {
	// 		console.log('no todos found!');
	// 	}

	// }).catch(function(e){
	// 	console.log(e);
	// });
// });













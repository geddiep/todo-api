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



var User = sequelize.define('user',{
	email: Sequelize.STRING
});


Todo.belongsTo(User);
User.hasMany(Todo);

//challenge option 2
sequelize.sync({
	//force: true 
}).then (function(){
	console.log('Everything is synced');

	User.findById(1).then(function(user){

		user.getTodos({
			where: {
				completed: true
			}
		}).then(function(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		});
	});

	// User.create({
	// 	email: 'test@test.com'
	// }).then(function(){
	// 	return Todo.create({
	// 		description: 'Clean yard'
	// 	});
	// }).then(function(todo){
	// 	User.findById(1).then(function (user){
	// 		user.addTodo(todo);
	// 	});
	// });
	


});
















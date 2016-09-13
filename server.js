var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var _ = require('underscore');
var db = require('./db.js');

// var todos	= [{
// 	id: 		1,
// 	description:'Meet mom for lunch',
// 	completed: 	false 		
// }, {
// 	id: 		2,
// 	description: 'Go to market!',
// 	completed: false
// }, {
// 	id: 		3,
// 	description: 'Walk the dog',
// 	completed: true
// }];


var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


// GET /todos
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	//######## second TRY ###################
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if(query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}

	if (query.hasOwnProperty('search') && query.search.length > 0){
		where.description = {$like: '%'+query.search+'%'};
	}

	db.todo.findAll({where: where}).then (function(todos){
		if(!!todos)
			res.json(todos);
		else
			res.status(400).send();
	}, function(e){
		res.status(500).send();
	});


	// //############## INITIAL try ##################
	// var queryParams = req.query;
	// var filteredTodos = todos;

	// //completed?
	// if (queryParams.hasOwnProperty('completed')) {
	// 	if (queryParams.completed === 'true')
	// 		filteredTodos = _.where(filteredTodos, {
	// 			completed: true
	// 		});
	// 	else if (queryParams.completed === 'false')
	// 		filteredTodos = _.where(filteredTodos, {
	// 			completed: false
	// 		});
	// }
	// //search
	// if (queryParams.hasOwnProperty('search') && queryParams.search.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		if (todo.description.toLowerCase().indexOf(queryParams.search.toLowerCase()) > -1)
	// 			return todo;
	// 	});
	// }

	// res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	db.todo.findById(todoId).then (function (todo){
		if(!!todo)
			res.json(todo.toJSON());
		else
			res.status(400).send();
	}, function(e){
		res.status(500).send();
	});

	// var todoFound = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (todoFound != undefined) {
	// 	res.json(todoFound);
	// } else {
	// 	res.status(404).send();
	// }
});

//POST todos
app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed'); //keep only these 2

	//his way
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});

	// //my way
	// db.todo.create({
	// 	description: body.description,
	// 	completed: body.completed
	// }).then(function(todo){
	// 	return res.json(todo);
	// }).catch(function(e){
	// 	return res.status(400).json(e);
	// });


	// //#### VALIDATION ################
	// var body = _.pick(req.body, 'description', 'completed'); //keep only these 2
	// if (!_.isBoolean(body.completed) ||
	// 	!_.isString(body.description) ||
	// 	body.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// body.description = body.description.trim(); //clean it up
	// body.id = todoNextId; //set the id
	// todos.push(body);
	// todoNextId++;
	// res.json(body);
});


// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var todoFound = _.findWhere(todos, {
		id: todoId
	});

	if (todoFound != undefined) {
		todos = _.without(todos, todoFound);
		res.json(todoFound);
	} else {
		res.status(404).send();
	}
});

//update
app.put('/todos/:id', function(req, res) {

	//#### VALIDATION ################
	var todoId = parseInt(req.params.id, 10);
	var todoFound = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed'); //keep only these 2
	var validAttributes = [];

	if (!todoFound) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	todoFound = _.extend(todoFound, validAttributes);
	res.json(todoFound);
});

db.sequelize.sync().then(function(){
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});

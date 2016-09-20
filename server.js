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

//######### TODOS ###########################################
// GET /todos
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	//######## second TRY ###################
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('search') && query.search.length > 0) {
		where.description = {
			$like: '%' + query.search + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		if (!!todos)
			res.json(todos);
		else
			res.status(400).send();
	}, function(e) {
		res.status(500).send();
	});
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo)
			res.json(todo.toJSON());
		else
			res.status(400).send();
	}, function(e) {
		res.status(500).send();
	});
});

//POST todos
app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed'); //keep only these 2

	//his way
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var where = {};
	where.id = todoId;
	db.todo.destroy({
		where: where
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(400).send({
				error: 'No todo with id ' + todoId
			});
		} else {
			res.status(204).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

//update
app.put('/todos/:id', function(req, res) {


	var todoId = parseInt(req.params.id, 10);

	var body = _.pick(req.body, 'description', 'completed'); //keep only these 2
	var attributes = [];

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		//this runs if findById worked
		if (todo) {
			todo.update(attributes).then(function(todo) {
				//this is a followup for todo.update
				res.json(todo.toJSON());
			}, function(e) {
				//this is if todo.update failed
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		//this fires if findById failed
		res.status(500).send();
	});

});

//#########   USERS #########################################
//POST users
app.post('/users', function(req, res) {

	var body = _.pick(req.body, 'email', 'password'); //keep only these 2

	//his way
	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});




db.sequelize.sync({force:true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
var express = require('express');
var bodyParser = require('body-parser');
var app 	= express();
var PORT 	= process.env.PORT || 3000;
var _ = require('underscore');


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

app.get('/', function (req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req,res){
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId 	= parseInt(req.params.id);
	var todoFound = _.findWhere(todos, {id: todoId});

	if(todoFound != undefined){
		res.json(todoFound);
	} else{
		res.status(404).send();	
	}
	
});

//post todos
app.post('/todos', function(req,res){

	//#### VALIDATION ################
	var body= _.pick(req.body,'description','completed'); //keep only these 2
	if(	!_.isBoolean(body.completed) || 
		!_.isString(body.description) || 
		body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description= body.description.trim(); 	//clean it up
	body.id 		= todoNextId; 				//set the id
	todos.push(body);
	todoNextId++;
	res.json(body);
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});














































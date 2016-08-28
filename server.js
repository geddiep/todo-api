var express = require('express');
var app 	= express();
var PORT 	= process.env.PORT || 3000;
var todos	= [{
	id: 		1,
	description:'Meet mom for lunch',
	completed: 	false 		
}, {
	id: 		2,
	description: 'Go to market',
	completed: false
}, {
	id: 		3,
	description: 'Walk the dog',
	completed: true
}];

app.get('/', function (req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req,res){
	res.json(todos);
});
// GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId 	= req.params.id;
	var todoFound;
	//res.send('Asking for todo with id of ' + req.params.id);

	for (var i = 0, len = todos.length; i < len; i++) {
		var todo = todos[i];

		if(todo.id == todoId){
			todoFound = todo;
			continue;
		}
	}

	if(todoFound != undefined){
		res.json(todoFound);
	} else{
		res.status(404).send();	
	}
	
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT + '!');
});














































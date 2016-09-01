

// var person = {
// 	name: 'Patrick',
// 	age: 21
// }


// function updatePerson(obj){
// 	obj = {
// 		name: 'Patrick',
// 		age: 21
// 	};
// }

// updatePerson(person);

// console.log(person);

//Array Example

var grades = [15,37];

function addGrade(array){
	array.push(88);
}

function addGrade1(array){
	array = [15,37, 88];
	debugger;
}

addGrade(grades);

//addGrade1(grades);


console.log(grades);
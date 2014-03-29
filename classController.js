var mongoose = require('mongoose'),
	fs = require('fs'),
	ClassHistory = mongoose.model('ClassHistory'),
	Student = mongoose.model('Student'),
	Question = mongoose.model('Question'),
	classTable = {}
	;

exports.new_class = function (data, callback) {
    console.log(data);
	var new_class = new ClassHistory(data);
	fs.readFile('./student.json', function(err, string){
		if (err){
			console.log(err);
			return;
		}
		//stu_id, name
		var array = JSON.parse(string);

		for (var i = array.length - 1; i >= 0; i--) {

			var newStudent = new Student(array[i]);
			new_class.student_list.push(newStudent);
		}

		new_class.save(function(err, result){
			if (err){
				console.log(err);
				return;
			}

			classTable[result._id] = result;
			callback(result);
		});
	});
};
exports.lock_student = function(data){//class_id, stu_id
	var currentClass = classTable[data.class_id];

	for (var i = currentClass.student_list.length - 1; i >= 0; i--) {
		if(currentClass.student_list[i].stu_id == data.stu_id){
			currentClass.student_list[i].lock = true;
			var query = {_id:currentClass._id, 'student_list.stu_id':data.stu_id};
			var update = {$set:{'student_list.$.come':!currentClass.student_list[i].come}};
			ClassHistory.update(query, update, function(){});
			break;
		}
	}
};

exports.lock_class = function(data, callback){
	classTable[data.class_id].lock = true;
};
exports.student_list = function(data, callback) {
	ClassHistory.findOne({_id:data}, function(err, result){
		callback(result.student_list);
	});
};
exports.come = function(data, isCome,callback) {
	var currentClass = classTable[data.class_id],
		returnString = 'ok';
	if (currentClass == null){
		ClassHistory.findOne({_id:data.class_id}, function(err, result){
			if (result) {
				classTable[data.class_id] = result;
				currentClass = result;
				action_new();
			}else{
				callback('id_wrong');
			}
			
		});
	}
	else if(currentClass.lock === false){
		action_new();
	}
	function action_new(){
			for (var i = currentClass.student_list.length - 1; i >= 0; i--) {
				if(currentClass.student_list[i].lock === false&&currentClass.student_list[i].stu_id === data.stu_id) {
					currentClass.student_list[i].come = true;
					returnString = 'ok';
				}
			}
			var query = {_id:currentClass._id, 'student_list.stu_id':data.stu_id};
			var update = {$set:{'student_list.$.come':isCome}};
			ClassHistory.update(query, update, function(){});
			callback(returnString);
		}
};

exports.class_list = function(callback) {
	ClassHistory.aggregate(
	{$project : {
		_id:1,
		class_name : 1,
		class_room : 1,
		class_time : 1
	}
		
	}, function(err, result){
		callback(result);
	});
};

exports.find_class = function(id, callback){
	ClassHistory.findOne({_id:id}, function(err, result){
		classTable[id] = result;
		callback(result);
	});
};

exports.start_vote = function(id, callback){
	var currentClass = classTable[id];
	currentClass.isVote = true;
	var order = currentClass.question_list.length +1;
	currentClass.currentQuestion = new Question({name:order});
	currentClass.count = {a:0,b:0, c:0, d:0};
	

	callback(order);
};

exports.voting = function(data, callback) {
	var currentClass = classTable[data.class_id],
		returnString = 'ok',
		answer = {stu_id:data.stu_id, answer:data.answer};

	if (data.answer == 'A') currentClass.count.a++;
	else if (data.answer == 'B') currentClass.count.b++;
	else if (data.answer == 'C') currentClass.count.c++;
	else if (data.answer == 'D') currentClass.count.d++;

	if (currentClass.lock ===false&& 
		currentClass.hasOwnProperty('isVote') &&
		currentClass.isVote === true){
		currentClass.currentQuestion.answer.push(answer);
		callback(answer);
	} 
	else{
	callback('not ok');	
	}
};
exports.vote_result_list = function(data, callback){
	var list = [];
	ClassHistory.findOne({_id:data}, function(err, result){
		for (var i = result.question_list.length - 1; i >= 0; i--) {
			var a=0,b=0,c=0,d=0;
			for (var j = result.question_list[i].answer.length - 1; j >= 0; j--) {
				switch(result.question_list[i].answer[j].answer)
			{
			    case 'A':a++;break;
			    case 'B':b++;break;
			    case 'C':c++;break;
			    case 'D':d++;break;
			    }
			}
			list.push({order:result.question_list[i].name, a:a, b:b, c:c, d:d});
		}
		callback(list);
	});
};
exports.end_vote = function(data, callback) {
	var currentClass = classTable[data.class_id],
		returnString = 'ok';

	if (currentClass.lock ===false&& 
		currentClass.hasOwnProperty('isVote') &&
		currentClass.isVote === true){
		var query = {_id:currentClass._id};
		var update = {$push:{'question_list':currentClass.currentQuestion}};		
		ClassHistory.update(query, update, function(err, result){
			callback(result.question_list, currentClass.count);
		});
	} 
	else{
		callback('not ok');
	}		
};
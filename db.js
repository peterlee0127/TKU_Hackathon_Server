var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	url = 'mongodb://localhost/hack'
	;

var student = new Schema({
	'stu_id':String,
	'name':String,
	'come':{
		type:String,
		default:'false',
		required:true
	},
	'lock':{
		type:Boolean,
		default:false,
		required:true
	}
});

var question = new Schema({
	'name' : String,
	'answer':[
		{
			stu_id : String,
			answer : String
		}
	]
});

var classHistory = new Schema({
	admin:String,
	student_list : [student],
	class_name : String,
	class_room : String,
	class_time : String,
	question_list : [question],
	'lock':{
		type:Boolean,
		default:false,
		required:true
	}
});

classHistory.set('collection', 'classHistory');
mongoose.model('Student', student);
mongoose.model('Question', question);
mongoose.model('ClassHistory', classHistory);
mongoose.connect(url);
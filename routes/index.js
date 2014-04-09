
/*
 * GET home page.
 */
var classController = require('../classController.js');
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.login = function(req, res){
	console.log(req.body);
	if (req.body.hasOwnProperty('email')&&
		req.body.email == 'admin@admin') {
		req.session.user = 'admin';

		res.redirect('/course');
	}else
		res.redirect('/login');

};
/*
	class_name : String,
	class_room : String,
	class_time : String,
*/
exports.newClass = function(req, res){
	classController.new_class(req.body, function(result){
		res.json(result);
	});
};
exports.student_list = function(req, res) {
	classController.student_list(req.params.id, function(result){
		res.json(result);
	});
};
exports.classPage = function(req, res){
	classController.find_class(req.params.id, function(result){
		res.render('index', {string : JSON.stringify(result) });
	});
};
exports.course = function(req, res) {
	classController.class_list(function(result){
		res.render('newClass', { json:JSON.stringify(result) });
	});
};
exports.class_List = function(req, res) {
	classController.class_list(function(result){
		res.json(result);
	});
};
exports.vote_result_list = function(req, res){
	classController.vote_result_list(req.params.id, function(result){
		res.json(result);
	});
};
exports.find_Class = function(req, res){
	var id = req.params.id;
	if (id) {
			classController.find_class(id, function(result){
				res.json(result);
			});
	}
	else
	{
		res.end('no id');
	}
};

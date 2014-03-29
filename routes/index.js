
/*
 * GET home page.
 */
var classController = require('../classController.js');
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
/*
	class_name : String,
	class_room : String,
	class_time : String,
*/
exports.newClass = function(req, res){
	// req.body = {
	// 	class_name : '微積分',
	// 	class_room : 'E405',
	// 	class_time : 'Friday',
	// };
	classController.new_class(req.body, function(result){
		classController.class_list(function(result){
			res.redirect('/course');
		});
	});
};
exports.classPage = function(req, res){
	classController.find_class(req.params.id, function(result){
		res.render('index', {json : JSON.stringify(result) });
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

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
	req.body = {
		class_name : '微積分',
		class_room : 'E405',
		class_time : 'Friday',
	};
	classController.new_class(req.body, function(result){
		res.json(result);
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
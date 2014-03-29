var classController = require('./classController');

exports.connect = function (socket) {
	socket.on('addme', function(obj){//stu_id, class_id
		classController.come(obj, function(string){
			if (string == 'ok') {
				socket.join(obj.class_id);
			}
			socket.emit('addme_res', string);
		});
	});

	socket.on('vote_req', function(obj){
		//class_id
		classController.start_vote(obj.class_id, function(){
			socket.broadcast.to(obj.class_id).emit('start_vote', {});
		});
	});
};
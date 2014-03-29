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
		console.log('vote_req'+obj);
		//class_id
		classController.start_vote(obj.class_id, function(order){
			socket.broadcast.to(obj.class_id).emit('start_vote', {
				'order':order,
				'class_id':obj.class_id
			});
		});
	});

	socket.on('voting', function(obj) {//stu_id, class_id, answer
		classController.voting(obj, function(answer){
			socket.broadcast.to(obj.class_id).emit('voting_res', answer);
		});
	});

	socket.on('end_vote', function(obj){//class_id
		classController.end_vote(obj, function(result, count){
			console.log(count);
			socket.broadcast.to(obj.class_id).emit('vote_result', count);//a,b,c,d
		});
	});

	socket.on('chat', function(obj){//stu_id, message, class_id
		socket.broadcast.to(obj.class_id).emit('listen_chat', obj);
	});
};
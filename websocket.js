var classController = require('./classController');
var user_socket_table = {};

exports.connect = function (io, socket) {
	socket.on('addme', function(obj){//stu_id, class_id
		classController.come(obj,true, function(string){
			if (string == 'ok') {
				socket.join(obj.class_id);
				socket.broadcast.to(obj.class_id).emit('come', obj);
			}
			socket.emit('addme_res', string);
				user_socket_table[socket.id] = obj;
		});
	});

	socket.on('disconnect', function(){
		classController.come(user_socket_table[socket.id],false, function(string){
			if (string !== 'lock')
			socket.broadcast.to(user_socket_table[socket.id].class_id).emit('not_come',user_socket_table[socket.id]);
		});
	});

	socket.on('vote_req', function(obj){
		console.log('vote_req'+obj);
		//class_id
		classController.start_vote(obj.class_id, function(order){
			if(order != 'no'){

				socket.broadcast.to(obj.class_id).emit('start_vote', {
					'name':order,
					'class_id':obj.class_id
				});
				socket.emit('start_vote', {
					'name':order,
					'class_id':obj.class_id
				});
			}
			
		});
	});
	socket.on('one_vote_result', function(obj){
		classController.vote_result_list(obj.class_id, function(result){
			for (var i = result.length - 1; i >= 0; i--) {
				if(result[i].order == obj.order){
					socket.emit('one_vote_result_res', result[i]);
				}
			}
		});
	});
	socket.on('force_change_Come', function(data){
		console.log('force_change_Come'+data.class_id);
		classController.lock_student(data);
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
			socket.emit('vote_result', count);//a,b,c,d

		});
	});

	socket.on('chat', function(obj){//stu_id, message, class_id
		socket.broadcast.to(obj.class_id).emit('listen_chat', obj);
	});
};
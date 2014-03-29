var socket = io.connect('http://localhost:3000');
var since = getDateTime();
socket.on('connect', function() {
    socket.emit('addme', {'stu_id':'admin', 'class_id':json._id});
});

socket.on('listen_chat',function(data) {
	var e = $('<li class="other_chat">'+
				'<div class="chat-body clearfix">'+
					'<div class="chat_id">'+
						'<strong class="primary-font chat_name">'+data.stu_id+'</strong>'+
							'<small class="pull-right text-muted">'+
								'<span class="glyphicon glyphicon-time"></span>'+since+
							'</small>'+
						'</div>'+
					'<p>'+data.message+'</p>'+
				'</div>'+
			'</li>');
	$('#ListenChat').append(e);
	var objDiv = document.getElementById("chat_box_outer");
	objDiv.scrollTop = objDiv.scrollHeight;
});

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        month = '0'+month;
    }
    if(day.toString().length == 1) {
        day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        second = '0'+second;
    }   
    var dateTime = hour+':'+minute+':'+second;
    return dateTime;
}
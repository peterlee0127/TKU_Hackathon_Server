fixVoteresult(json);
addStudent();
function addStudent()
{
    for (var i = json.student_list.length-1; i>=0; i--)
    {
        var nameANDhere = $('<tr id="' + json.student_list[i].stu_id+ '">'+
                                '<td>'+ json.student_list[i].name + '</td>'+
                                '<td>'+ 
                                    '<a onclick="force_change_come('+json.student_list[i].stu_id+')">'+
                                    '<div>'+json.student_list[i].come + '</div>'
                                    +'</a></td>'
                            +'</tr>');
        $('tbody').append(nameANDhere);
    }
}
function force_change_come(id)
{
    socket.emit('force_change_Come', {'stu_id':id});
    var  come = $('#'+id+' td a').html();
    if ((come === "true"))
    {
        $('#'+id+' td a').html('false');
    }
    else 
    {
        $('#'+id+' td a').html('true');
    }
}
function addAnswerTitle(data)
{
    var answer_num = $('<th>A' + data.number + '</th>');
    $('.table_header').append(answer_num);
    $("tbody tr").each(function()
    {
        var answerHtml = $('<td>X</td>'); 
        $(this).append(answerHtml);
    });
}
function addAnswer(data)  //{"name":{},"answers":[{"answer":"A","stu_id":499410743}
{
    var answer_id = data.answers[0].stu_id;
    var id = answer_id.toString();
    var answer = data.answers[0].answer.toString();
    $("tbody tr").each(function()
    {
        if(id==this.id)
        {
            $(this.lastChild).html(answer);
        }
    });
}
function fixVoteresult(data)
{
    var result = [];
        for (var i = data.student_list.length - 1; i >= 0; i--) {
            var id = data.student_list[i].stu_id;
            var stu_answers = [];
            var isAnswer = false;
            for (var j = data.question_list.length - 1; j >= 0; j--) {
            isAnswer = false;
            for (var k = data.question_list[j].answer.length - 1; k >= 0; k--) {
                if (data.question_list[j].answer[k].stu_id == id) {
                    stu_answers.push(data.question_list[j].answer[k].answer);
                    isAnswer = true;
                }
            }
            if (!isAnswer) {stu_answers.push('X');}
        }
        result.push({'stu_id':id, 'answers':stu_answers});
    }
    data.answers = result;
}

socket.on('start_vote', addAnswerTitle);
socket.on('voting', addAnswer);

socket.on('addmeRES', function(data){
    $('#'+data.stu_id+' td a div').html('true');
});
socket.on('notcome', function(data){
    $('#'+data.stu_id+' td a div').html('false');
});

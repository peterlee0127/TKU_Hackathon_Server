fixVoteresult(json);
addStudent(json);

function addStudent(json)
{   
    var str;
    for (var i = json.student_list.length-1; i>=0; i--)
    {
        if(json.student_list[i].come == 'true')
        {
            str = ' style="color:green;">有到';
            // str = "有到";
        }
        else
        {
            str = ' style="color:red;">未到';
            // str = "未到";
        }
        var nameANDhere = $('<tr id="' + json.student_list[i].stu_id+ '">'+
                                '<td>'+ json.student_list[i].name + '</td>'+
                                '<td>'+ 
                                    '<a onclick="force_change_come('+json.student_list[i].stu_id+')">'+
                                    '<div'+ str + '</div>'
                                    +'</a></td>'
                            +'</tr>');
        $('tbody').append(nameANDhere);
    }
}
function force_change_come(id)
{
    socket.emit('force_change_Come', {'stu_id':id, "class_id":json._id});
    var  come = $('#'+id+' td a').html();
    if ((come === "有到"))
    {
        $('#'+id+' td a').html('未到');
        $('#'+id+' td a').css({
            "color" : "red"
        });
    }
    else 
    {
        $('#'+id+' td a').html('有到');
        $('#'+id+' td a').css({
            "color" : "green"
        });
    }
}
function addAnswerTitle(data)
{
    var answer_num = $('<th><a onclick="change_chart_of_vote('+data.name+')">' + data.name + '</a></th>');
    $('.table_header').append(answer_num);
    $("tbody tr").each(function()
    {
        var answerHtml = $('<td>X</td>'); 
        $(this).append(answerHtml);
    });
}
function addAnswer(data)  //{"answer":"A","stu_id":499410743}
{
    if(data){
        var answer_id = data.stu_id;
    var id = answer_id.toString();
    var answer = data.answer;
    $("tbody tr").each(function()
    {
        if(id==this.id)
        {
            $(this.lastChild).html(answer);
        }
    });
    }
    
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
(function(){
    for (var i =0,max= json.question_list.length; i <max; i++) {
        addAnswerTitle(json.question_list[i]);
        for (var j = json.question_list[i].answer.length - 1; j >= 0; j--) {
           addAnswer( json.question_list[i].answer[j]);
        }
    }
})();
function change_chart_of_vote(order){
    socket.emit('one_vote_result', {class_id:json._id, order:order});
}

socket.on('start_vote', addAnswerTitle);
socket.on('voting_res', addAnswer);

socket.on('come', function(data){
    $('#'+data.stu_id+' td a div').html('有到');
    $('#'+data.stu_id+' td a div').css({
        "color" : "green"
    });
});
socket.on('not_come', function(data){
    $('#'+data.stu_id+' td a div').html('未到');
    $('#'+data.stu_id+' td a div').css({
        "color" : "red"
    });
});

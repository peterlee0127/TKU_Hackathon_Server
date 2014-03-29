function add_Class()
{
    var name = $('#name').val();
    var room = $('#room').val();
    var time = $('#time').val();    
    var data = $('<tr>'+
                            '<td>'+ name +'</td>'+
                            '<td>'+ room +'</td>'+
                            '<td>'+ time +'</td>'+
                    '</tr>');
    $('tbody').append(data);
    
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "localhost:3000/course/api/newClass",
        data: "{'class_name':'" + name + "', 'class_room':'" + room + "', 'class_time':'" + time + "'}",
    });
}
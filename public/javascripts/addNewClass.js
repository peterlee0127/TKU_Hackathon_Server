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
        url: "http://localhost:3000/api/newClass",
        data: "&class_name="+name+"&class_room="+room+"class_time="+time,
        dataType:'json'
    });
}
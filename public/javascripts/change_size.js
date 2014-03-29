var win_height = $(window).height();
var top_height = 160;
var bottom_height = 287;

$(document).ready(function(){
    var caculate_height = win_height - (top_height+bottom_height);
    $(".chat_box").height(caculate_height);
    observe_overflow();
});

$(window).resize(function(){
    var current_height = $(window).height();
    var caculate_height = current_height - (top_height+bottom_height);
    $(".chat_box").height(caculate_height);
    
    observe_overflow();
});

function observe_overflow()
{
    var current_height = $(window).height();
    var current_width = $(window).width();
    $(".middle_container").css("height", current_height-$(".navbar").height()-$(".table").height()-10);
    if(current_width<1200)
    {
        $(".middle_container").css({
            "overflow-y": "scroll",
            "overflow-x": "hidden"
        });
        $(".table_container").css({
            "bottom": "0"
        });
        $(".header_style").hide();
        $(".customer_counter").hide();
        $(".footer").hide();
    }
    else
    {
        $(".middle_container").css("height", $(".left_box").height());
        $(".middle_container").css({
            "height":"auto",
            "overflow": "inherit"
        });
        $(".table_container").css({
            "bottom": "45px"
        });
        $(".header_style").show();
        $(".customer_counter").show();
        $(".footer").show();
    }
}
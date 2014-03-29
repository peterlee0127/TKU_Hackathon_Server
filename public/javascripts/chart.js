var $sad = {};

$(document).ready(function(){
    clearBox(".chart_box");
    draw_vote_chart($sad);
});

$(window).resize(function()
{
  clearBox(".chart_box");
  draw_vote_chart($sad);
});

function clearBox(elementID)
{
    $(elementID).empty();
}


function count_vote(j){
  var a=0,b=0,c=0,d=0;
  var answers;
  if (j.question_list.length >0) {
    answers = j.question_list.slice(-1)[0].answer;
    for (var i = answers.length - 1; i >= 0; i--) {
      switch(answers[i].answer)
      {
        case 'A':a++;break;
        case 'B':b++;break;
        case 'C':c++;break;
        case 'D':d++;break;
      }
    }
  }
  $sad.a = a;
  $sad.b = b;
  $sad.c = c;
  $sad.d = d;
}


function draw_vote_chart(sad) {
  var a = sad.a,
      b = sad.b,
      c = sad.c,
      d = sad.d;
  var win_height = $(window).height();

  var data = [
            {letter:'A',frequency:a},
            {letter:'B',frequency:b},
            {letter:'C',frequency:c},
            {letter:'D',frequency:d}
          ];


  var margin = {top: 20, right: 30, bottom: 30, left: 45};
  var width;
  var current_width = $(window).width();
  if(current_width<1200)
  {
    width = $(".panel").width();
  }
  else
  {
    width = (1280*0.69) - margin.left - margin.right;
  }
  var height;
  if(current_width<1200)
  {
    height = $(".panel").height()-70;
  }
  else
  {
    height = $(".panel").height()-30;
  }

  var formatPercent = d3.format("d");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1, 1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

  var svg = d3.select(".chart_box").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    data.forEach(function(d)
    {
      d.letter=d.letter+"("+d.frequency+")";
      d.frequency = +d.frequency;
    });

    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([d3.min(data, function(d){return 0;}),d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("人數");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); });

    d3.select("input").on("change", change);

    var sortTimeout = setTimeout(function() {
      d3.select("input").property("checked", true).each(change);
    }, 200000);

    function change() {
      clearTimeout(sortTimeout);

      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(data.sort(this.checked?
            function(a, b) { return b.frequency - a.frequency; }
          : function(a, b) { return d3.ascending(a.letter, b.letter); })
          .map(function(d) { return d.letter; }))
          .copy();

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("x", function(d) { return x0(d.letter); });

      transition.select(".x.axis")
          .call(xAxis)
        .selectAll("g")
          .delay(delay);
    }
}

function reload_vote_date(voteResult){
  count_vote({'question_list':[voteResult]});
  d3.select("svg").remove();
  draw_vote_chart($sad);
}
count_vote(json);
draw_vote_chart($sad);

function voting(voteResult){
  reload_vote_date(voteResult);
}

socket.on('start_vote', function(){
    d3.select("svg").remove();
    $sad.a = 0;
  $sad.b = 0;
  $sad.c = 0;
  $sad.d = 0;
  draw_vote_chart($sad);
});
socket.on('voting_res', function(answer){
  switch(answer.answer)
      {
        case 'A':$sad.a++;break;
        case 'B':$sad.b++;break;
        case 'C':$sad.c++;break;
        case 'D':$sad.d++;break;
      }
        d3.select("svg").remove();

        draw_vote_chart($sad);

});
socket.on('vote_result', function(result){
  d3.select("svg").remove();
  draw_vote_chart(result);
});

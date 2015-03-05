// Function to convert hh:mm:ss to seconds
function hmsToSeconds(str) {
    var s = parseFloat(str.split(',')[1])/1000,
        p0 = str.split(',')[0];
    var p = p0.split(':'),
        m = 1;
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
} // End Function to convert hh:mm:ss to seconds

window.onload = function(){
  var fileInput = document.getElementById('fileInput');
  var fileDisplayArea = $("#subtitleText");
  var maxWords = 0;
  fileInput.addEventListener('change', function(e){
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      var resultArray = reader.result.split("\n");
      var displayhtml = [];
      var linenumbers = [];
      var timingArray = [];
      var dialogueArray = [];
      // populate individual arrays
      for (var i=0; i<resultArray.length; i++){
        if (i == 0){
          linenumbers.push(resultArray[i]);
          timingArray.push(resultArray[i+1]);
          var j = i+2;
          var tempDialogue = "";
          while (resultArray[j].length > 1){
            tempDialogue += resultArray[j]+"<br>";
            j++;
          }
          dialogueArray.push(tempDialogue);
        }
        if (resultArray[i].length <= 1){
          // collect all serial numbers
          if (i+1 < resultArray.length && 
              resultArray[i+1] != ""){
            linenumbers.push(resultArray[i+1]);
          }
          // collect all timing
          if (i+2 < resultArray.length){
            timingArray.push(resultArray[i+2]);
          }
          if (i+3 < resultArray.length){
            var j = i+3;
            var tempDialogue = "";
            while (resultArray[j].length > 1 && 
                   j+1 < resultArray.length){
              tempDialogue += resultArray[j]+"<br>";
              j++;
            }
            if (tempDialogue.split(" ").length > maxWords){
              maxWords = tempDialogue.split(" ").length;
            }
            dialogueArray.push(tempDialogue);
          }
        }
      }

      // populate the subtitle display area
      var displayHTML = "<ul>";
      for (var i=0; i<linenumbers.length; i++){
       displayHTML+= "<li id="+linenumbers[i]+">" +
                     linenumbers[i] + "<br>" +
                     timingArray[i] + "<br>" +
                     dialogueArray[i] + "<br>" + "</li>";
      }
      displayHTML+= "</ul>";
      fileDisplayArea.empty();
      fileDisplayArea.append(displayHTML);
      // end populating the subtitle display area

      // populate graphical display 1: sequential
      var fillColor = "rgba(123,123,123,0.2)";
      d3.select("#sequence").selectAll("svg").remove();
      var sequenceW = $("#sequence").width();
      var sequenceH = $("#sequence").height();
      var sequenceSvg = d3.select("#sequence").append("svg")
                       .attr("width", sequenceW)
                       .attr("height", sequenceH);
      var sequenceScale = d3.scale.linear()
                            .domain([0, linenumbers.length])
                            .range([0, sequenceW]);
      var sequenceData = [];
      for (var i=0; i<linenumbers.length; i++){
        var d = {};
        d.x = sequenceScale(linenumbers[i]);
        d.y = 0;
        d.width = sequenceW/linenumbers.length;
        d.height = sequenceH;
        d.index = i;
        sequenceData.push(d);
      }
      var sequenceRects = sequenceSvg.selectAll("rect")
            .data(sequenceData)
            .enter()
            .append("rect")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("width", function(d){ 
              return d.width;
            })
            .attr("height", function(d){ 
              return d.height;
            })
            .attr("fill", fillColor)
            .on("mouseover", function(d){
              d3.select(this).style("fill", "#dc143c");
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .addClass("highlight");
            })
            .on("mouseout", function(d){
              d3.select(this).style("fill", fillColor);
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .removeClass("highlight");
            })
            .on("click", function(d){
              $("#subtitleText").scrollTo(
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")"),
              {duration: 'slow',
                transition: 'ease-in-out'});
            });
      // end code for display 1: sequence
      // populate graphical display 2: scaled
      d3.select("#seqScaled").selectAll("svg").remove();
      var seqScaledW = $("#seqScaled").width();
      var seqScaledH = $("#seqScaled").height();
      var seqScaledSvg = d3.select("#seqScaled").append("svg")
                       .attr("width", seqScaledW)
                       .attr("height", seqScaledH);
      var seqScaledScale = d3.scale.linear()
                            .domain([0, linenumbers.length])
                            .range([0, seqScaledW]);
      var seqScaledData = [];
      for (var i=0; i<linenumbers.length; i++){
        var d = {};
        d.x = seqScaledScale(linenumbers[i]);
        d.y = 0;
        d.width = seqScaledW/linenumbers.length;
        d.height = seqScaledH*dialogueArray[i]
                      .split(" ").length/maxWords;
        d.index = i;
        d.text = dialogueArray[i];
        seqScaledData.push(d);
      }
      var seqScaledRects = seqScaledSvg.selectAll("rect")
            .data(seqScaledData)
            .enter()
            .append("rect")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("width", function(d){ 
              return d.width;
            })
            .attr("height", function(d){ 
              return d.height;
            })
            .attr("fill", fillColor)
            .on("mouseover", function(d){
              d3.select(this).style("fill", "#dc143c");
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .addClass("highlight");
            })
            .on("mouseout", function(d){
              d3.select(this).style("fill", fillColor);
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .removeClass("highlight");
            })
            .on("click", function(d){
              $("#subtitleText").scrollTo(
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")"),
              {duration: 'slow',
                transition: 'ease-in-out'});
            });
      // end code for display 2: scaled
      // populate graphical display 3: timeScaled
      d3.select("#timeScaled").selectAll("svg").remove();
      var timeScaledW = $("#timeScaled").width();
      var timeScaledH = $("#timeScaled").height();
      var timeScaledSvg = d3.select("#timeScaled").append("svg")
                       .attr("width", timeScaledW)
                       .attr("height", timeScaledH);
      var ltString = timingArray[timingArray.length-1].split("-->")[1];
      var lastTime = hmsToSeconds(ltString);
      var timeScaledScale = d3.scale.linear()
                            .domain([0, lastTime])
                            .range([0, timeScaledW]);
      var timeScaledData = [];
      for (var i=0; i<linenumbers.length; i++){
        var d = {};
        var stStr = timingArray[i].split("-->")[0];
        var st = hmsToSeconds(stStr);
        var etStr = timingArray[i].split("-->")[1];
        var et = hmsToSeconds(etStr);
        d.x = timeScaledScale(st);
        d.y = 0;
        d.width = timeScaledW/linenumbers.length;
        d.height = timeScaledH*dialogueArray[i]
                      .split(" ").length/maxWords;
        d.index = i;
        d.text = dialogueArray[i];
        timeScaledData.push(d);
      }
      var timeScaledRects = timeScaledSvg.selectAll("rect")
            .data(timeScaledData)
            .enter()
            .append("rect")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("width", function(d){ 
              return d.width;
            })
            .attr("height", function(d){ 
              return d.height;
            })
            .attr("fill", fillColor)
            .on("mouseover", function(d){
              d3.select(this).style("fill", "#dc143c");
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .addClass("highlight");
            })
            .on("mouseout", function(d){
              d3.select(this).style("fill", fillColor);
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .removeClass("highlight");
            })
            .on("click", function(d){
              $("#subtitleText").scrollTo(
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")"),
              {duration: 'slow',
                transition: 'ease-in-out'});
            });
      // end code for display 3: timeScaled
      // populate graphical display 4: timeScaledWidth
      d3.select("#timeScaledWidth").selectAll("svg").remove();
      var timeScaledWidthW = $("#timeScaledWidth").width();
      var timeScaledWidthH = $("#timeScaledWidth").height();
      var timeScaledWidthSvg = d3.select("#timeScaledWidth").append("svg")
                       .attr("width", timeScaledWidthW)
                       .attr("height", timeScaledWidthH);
      var ltString = timingArray[timingArray.length-1].split("-->")[1];
      var lastTime = hmsToSeconds(ltString);
      var timeScaledWidthScale = d3.scale.linear()
                            .domain([0, lastTime])
                            .range([0, timeScaledWidthW]);
      var timeScaledWidthData = [];
      for (var i=0; i<linenumbers.length; i++){
        var d = {};
        var stStr = timingArray[i].split("-->")[0];
        var st = hmsToSeconds(stStr);
        var etStr = timingArray[i].split("-->")[1];
        var et = hmsToSeconds(etStr);
        d.x = timeScaledWidthScale(st);
        d.y = 0;
        d.width = timeScaledScale(et-st);
        d.height = timeScaledWidthH;
        d.index = i;
        d.text = dialogueArray[i];
        timeScaledWidthData.push(d);
      }
      var timeScaledWidthRects = timeScaledWidthSvg.selectAll("rect")
            .data(timeScaledWidthData)
            .enter()
            .append("rect")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("width", function(d){ 
              return d.width;
            })
            .attr("height", function(d){ 
              return d.height;
            })
            .attr("fill", fillColor)
            .on("mouseover", function(d){
              d3.select(this).style("fill", "#dc143c");
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .addClass("highlight");
            })
            .on("mouseout", function(d){
              d3.select(this).style("fill", fillColor);
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .removeClass("highlight");
            })
            .on("click", function(d){
              $("#subtitleText").scrollTo(
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")"),
              {duration: 'slow',
                transition: 'ease-in-out'});
            });
      // end code for display 4: timeScaledWidth
      // populate graphical display 5: timeScaledEqual
      d3.select("#timeScaledEqual").selectAll("svg").remove();
      var timeScaledEqualW = $("#timeScaledEqual").width();
      var timeScaledEqualH = $("#timeScaledEqual").height();
      var timeScaledEqualSvg = d3.select("#timeScaledEqual").append("svg")
                       .attr("width", timeScaledEqualW)
                       .attr("height", timeScaledEqualH);
      var ltString = timingArray[timingArray.length-1].split("-->")[1];
      var lastTime = hmsToSeconds(ltString);
      var timeScaledEqualScale = d3.scale.linear()
                            .domain([0, lastTime])
                            .range([0, timeScaledEqualW]);
      var timeScaledEqualData = [];
      for (var i=0; i<linenumbers.length; i++){
        var d = {};
        var stStr = timingArray[i].split("-->")[0];
        var st = hmsToSeconds(stStr);
        var etStr = timingArray[i].split("-->")[1];
        var et = hmsToSeconds(etStr);
        d.x = timeScaledEqualScale(st);
        d.y = 0;
        d.width = 2;
        d.height = timeScaledEqualH;
        d.index = i;
        d.text = dialogueArray[i];
        timeScaledEqualData.push(d);
      }
      var timeScaledEqualRects = timeScaledEqualSvg.selectAll("rect")
            .data(timeScaledEqualData)
            .enter()
            .append("rect")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("width", function(d){ 
              return d.width;
            })
            .attr("height", function(d){ 
              return d.height;
            })
            .attr("fill", fillColor)
            .on("mouseover", function(d){
              d3.select(this).style("fill", "#dc143c");
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .addClass("highlight");
            })
            .on("mouseout", function(d){
              d3.select(this).style("fill", fillColor);
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledFisheye").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .removeClass("highlight");
            })
            .on("click", function(d){
              $("#subtitleText").scrollTo(
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")"),
              {duration: 'slow',
                transition: 'ease-in-out'});
            });
      // end code for display 5: timeScaledEqual
      // populate graphical display 6: timeScaledFisheye
      d3.select("#timeScaledFisheye").selectAll("svg").remove();
      var timeScaledFisheyeW = $("#timeScaledFisheye").width();
      var timeScaledFisheyeH = $("#timeScaledFisheye").height();
      var timeScaledFisheyeSvg = d3.select("#timeScaledFisheye").append("svg")
                       .attr("width", timeScaledFisheyeW)
                       .attr("height", timeScaledFisheyeH);
      var ltString = timingArray[timingArray.length-1].split("-->")[1];
      var lastTime = hmsToSeconds(ltString);
      var timeScaledFisheyeScale = d3.scale.linear()
                            .domain([0, lastTime])
                            .range([0, timeScaledFisheyeW]);
      var timeScaledFisheyeData = [];
      for (var i=0; i<linenumbers.length; i++){
        var d = {};
        var stStr = timingArray[i].split("-->")[0];
        var st = hmsToSeconds(stStr);
        var etStr = timingArray[i].split("-->")[1];
        var et = hmsToSeconds(etStr);
        d.x = timeScaledFisheyeScale(st);
        d.y = 0;
        d.width = 2;
        d.height = timeScaledFisheyeH;
        d.index = i;
        d.text = dialogueArray[i];
        timeScaledFisheyeData.push(d);
      }
      var timeScaledFisheyeRects = timeScaledFisheyeSvg.selectAll("rect")
            .data(timeScaledFisheyeData)
            .enter()
            .append("rect")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
            .attr("width", function(d){ 
              return d.width;
            })
            .attr("height", function(d){ 
              return d.height;
            })
            .attr("fill", fillColor)
            .on("mouseover", function(d){
              d3.select(this).style("fill", "#dc143c");
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": "#dc143c"});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .addClass("highlight");
            })
            .on("mouseout", function(d){
              d3.select(this).style("fill", fillColor);
              $("#timeScaledEqual").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaledWidth").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#timeScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#seqScaled").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#sequence").find("svg").first()
                  .children("rect:eq("+d.index+")")
                  .css({"fill": fillColor});
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")")
                  .removeClass("highlight");
            })
            .on("click", function(d){
              $("#subtitleText").scrollTo(
              $("#subtitleText").find("ul")
                  .first()
                  .children("li:eq("+d.index+")"),
              {duration: 'slow',
                transition: 'ease-in-out'});
            });
            var fisheyesvg = d3.select("#timeScaledFisheye")
                               .selectAll("svg");
            var frects = fisheyesvg.selectAll("rect");
            var fisheye = d3.fisheye.circular()
                            .radius(50)
                            .distortion(8);
            fisheyesvg.on("mousemove", function(){
              fisheye.focus(d3.mouse(this));
              frects.each(function(d){
                        d.fisheye = fisheye(d);
                     })
                     .attr("x", function (d) {
                       return d.fisheye.x;
                     });
            });
      // end code for display 6: timeScaledFisheye

      // begin subtitle interaction code
      $("#subtitleText").find("ul").first()
                        .on("mouseover", "li", function(){
        $(this).addClass("highlight");
        subIndex = $("#subtitleText").find("li").index(this);
        console.log(subIndex);
        $("#sequence").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": "#dc143c"});
        $("#seqScaled").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": "#dc143c"});
        $("#timeScaled").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": "#dc143c"});
        $("#timeScaledWidth").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": "#dc143c"});
        $("#timeScaledEqual").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": "#dc143c"});
        $("#timeScaledFisheye").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": "#dc143c"});
      });

      $("#subtitleText").find("ul").first()
                        .on("mouseout", "li", function(){
        $(this).removeClass("highlight");
        $("#sequence").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": fillColor});
        $("#seqScaled").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": fillColor});
        $("#timeScaled").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": fillColor});
        $("#timeScaledWidth").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": fillColor});
        $("#timeScaledEqual").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": fillColor});
        $("#timeScaledFisheye").find("svg").first()
            .children("rect:eq("+subIndex+")")
            .css({"fill": fillColor});
      });
      // end of subtitle interaction code
    }
    reader.readAsText(file, "UTF-8");
  });
}

var svgWidth = 900
var svgHeight = 500

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";

var chosenYAxis = "healthcare"

function xScale(census, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(census, d=> d[chosenXAxis]) * 0.8,
            d3.max(census, d=> d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;

}

function yScale(census, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(census, d=> d[chosenYAxis]) * 0.1 ,
            d3.max(census, d=> d[chosenYAxis]) * 1.2
        ])
        .range([height, 0 ]);
    return yLinearScale;

}
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}
function renderXCircles(circlesGroup, newXScale, chosenXAxis, textGroup) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]))

    return circlesGroup;
}

function yrenderText(textGroup, newYScale, chosenYAxis)  {

    textGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]))
    return textGroup;
}

function xrenderText(textGroup, newXScale, chosenXAxis)  {

    textGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
    return textGroup;
}


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
//this should be a switch case
    switch(chosenYAxis){
        case 'smokes':
            var ylabel = "Smokes:"
            break;
        case 'obesity':
            var ylabel = "Obesity:"
            break;
        case 'healthcare':
            var ylabel = "Healthcare %:"
    }
    if (chosenXAxis === "age") {
      var xlabel = "Age:";
    }
    else if (chosenXAxis === "poverty"){
        var xlabel = "Poverty:";
    }
    else {var xlabel = "Income:";}
        
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([40, 80])
      .html(function(d) {
        return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
};


d3.csv("./assets/data/data.csv", function(census) {
    // console.log(census)
   
    
    census.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });


    var xLinearScale = xScale(census, chosenXAxis);

    var yLinearScale = yScale(census, chosenYAxis)
    


    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    console.log(leftAxis)
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
    
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(-1, 0 )`)
        .call(leftAxis)    


    var circlesGroup = chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 8)
        .attr("fill", "blue")
        .attr("opacity", "1")

       
    var textGroup =    chartGroup.selectAll("text")
        .data(census)
        .enter()
        .append("text")
        .text(function (d) {return `${d.abbr}`})
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "green");
   
        

//Y Lables 
    var YlabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
    

    var smokeLabel = YlabelsGroup.append("text")
        .attr("x", -140)
        .attr("y", -70)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smoke");          

    var obisityLabel = YlabelsGroup.append("text")
        .attr("x", -150)
        .attr("y", -50)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity");   
    var healthLabel = YlabelsGroup.append("text")
        .attr("x", -180)
        .attr("y", -30)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare %");

//X Labels group
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width /3}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Poverty)");  

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Household Income(Median)");  

    // chartGroup.append("text")
    //     .attr("transform", "rotate(90)")
    //     .attr("y", 0 -margin.left)    
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("In poverty(%)");


    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;
        
        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(census, chosenXAxis);
        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
        textGroup = xrenderText(textGroup, xLinearScale, chosenXAxis)

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
        povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);
                
        }
        else if (chosenXAxis === "age"){
        ageLabel
            .classed("active", true)
            .classed("inactive", false);
        povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);    
        }
        else {
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        incomeLabel
        .classed("active", true)
        .classed("inactive", false);   
        }
      }
    });

    YlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      if (yvalue !== chosenYAxis) {

        // replaces chosenXaxis with value
        chosenYAxis = yvalue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(census, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, chosenXAxis, circlesGroup);
        textGroup = yrenderText(textGroup, yLinearScale, chosenYAxis)

        // changes classes to change bold text
        switch(chosenYAxis){
            case 'smokes':
            healthLabel
            .classed("active", false)
            .classed("inactive", true)
        smokeLabel
            .classed("active", true)
            .classed("inactive", false)
        obisityLabel
            .classed("active", false)
            .classed("inactive", true)
                break;
            case 'obesity':
            healthLabel
            .classed("active", false)
            .classed("inactive", true);
            smokeLabel
            .classed("active", false)
            .classed("inactive", true);
            obisityLabel
            .classed("active", true)
            .classed("inactive", false);
                break;
            case 'healthcare':
            healthLabel
            .classed("active", true)
            .classed("inactive", false)
            smokeLabel
            .classed("active", false)
            .classed("inactive", true)
            obisityLabel
            .classed("active", false)
            .classed("inactive", true)
        }
    } 
    });
});
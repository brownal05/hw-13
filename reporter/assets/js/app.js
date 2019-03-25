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

var chosenXAxis = "income";

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
        .domain([d3.min(census, d=> d[chosenYAxis]) * 0.8,
            d3.max(census, d=> d[chosenYAxis]) * 1.2
        ])
        .range([0, width]);
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
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {
//this should be a switch case
    if (chosenXAxis === "age") {
      var label = "age:";
    }
    else if (chosenXAxis === "poverty"){
        var label = "poverty:";
    }
    else (chosenXAxis === "income")
        var label = "income:";
    
     
 
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
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
    console.log(census)
   
    
    census.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income
        data.healthcareLow = +data.healthcareLow;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });


    var xLinearScale = xScale(census, chosenXAxis);
    
    var yLinearScale = yScale(census, chosenYAxis)
    
    // d3.scaleLinear()
    //     .domain([0, d3.max(census, d => d.income)])
    //     .range([height]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
    
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        // .attr("transform", `translate(${height}, -15 )`)
        .call(leftAxis)    

    // chartGroup.append("g")
    //     .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(census)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    var YlabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)",`translate(${height + 30}, ${width /3})`  )
        // .attr("transform", `translate(${height + 30}, ${width /3})`);
    
    var healthLabel = YlabelsGroup.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("value", "healthcareLow") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare %");

    var smokeLabel = YlabelsGroup.append("text")
        .attr("x", -20)
        .attr("y", 20)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smoke");          

    var obisityLabel = YlabelsGroup.append("text")
        .attr("x", -30)
        .attr("y", 30)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity");   

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
            .classed("inactive", true)
            .text("Household Income(Median)");  

    // chartGroup.append("text")
    //     .attr("transform", "rotate(90)")
    //     .attr("y", 0 -margin.left)    
    //     .attr("x", 0 - (height / 2))
    //     .attr("dy", "1em")
    //     .classed("axis-text", true)
    //     .text("In poverty(%)");


    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

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
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true);    
        }
        else 
        ageLabel
        .classed("active", true)
        .classed("inactive", false);
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        incomeLabel
        .classed("active", true)
        .classed("inactive", false);   
      }
    });

    YlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXaxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = yScale(census, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcareLow") {
        healthLabel
            .classed("active", true)
            .classed("inactive", false);
        smokeLabel
            .classed("active", false)
            .classed("inactive", true);
        obisityLabel
            .classed("active", false)
            .classed("inactive", true);
                
        }
        else if (chosenXAxis === "smokes"){
        healthLabel
            .classed("active", true)
            .classed("inactive", false);
        smokeLabel
            .classed("active", true)
            .classed("inactive", false);
        obisityLabel
            .classed("active", false)
            .classed("inactive", true);    
        }
        else 
        healthLabel
        .classed("active", true)
        .classed("inactive", false);
        smokeLabel
        .classed("active", false)
        .classed("inactive", true);
        obisityLabel
        .classed("active", true)
        .classed("inactive", false);   
      }
    });
    })
const drawLineChart = data => {

    // ---------- Margins and dimensions (same as Exercise 5.1) ----------
    const margin = { top: 40, right: 40, bottom: 25, left: 50 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // ---------- SVG container ----------
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0, 0, ${width}, ${height}`)
        .style("border", "1px solid black");

    // ---------- Inner chart group ----------
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ---------- Scales (both continuous, so scaleLinear) ----------
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))          // [1998, 2024]
        .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .range([innerHeight, 0]);

    // ---------- Axes ----------
    const bottomAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));                   // show 2000, not 2,000

    const leftAxis = d3.axisLeft(yScale);

    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    innerChart.append("g")
        .call(leftAxis);

    // ---------- Y-axis label ----------
    innerChart.append("text")
        .text("Average Spot Price ($ per MWh)")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .style("font-size", "14px");

    // ---------- Line generator ----------
    const lineGenerator = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice));
        // Optional: .curve(d3.curveMonotoneX)  (smoother, but less accurate)

    // ---------- Draw the line (a line is a <path>) ----------
    innerChart.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#147d7d")
        .attr("stroke-width", 3);

    // ---------- Scatter plot points ----------
    innerChart.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.averagePrice))
        .attr("fill", "#147d7d");
};

// ---------- Load and convert the data ----------
d3.csv("assets/data/ARE_Spot_Prices.csv", d => ({
    year: +d.Year,                                              // string -> number
    averagePrice: +d["Average Price (notTas-Snowy)"]
}))
.then(data => {
    console.log(data);
    drawLineChart(data);
})
.catch(error => console.error("Error loading CSV:", error));
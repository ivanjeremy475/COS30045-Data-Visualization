// Step 1: Set up responsive SVG container with smaller viewBox width (500x800)
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 500 800")
    .style("border", "1px solid black");

// Step 2: Load CSV data and convert count column to numbers (+d.count)
d3.csv("data/4.4exportdata.csv", d => {
  return {
    brand: d.brand,
    count: +d.count // Converts string count to a number
  };
}).then(data => {
  console.log("Loaded Data:", data);

  // Sort data descending by count
  data.sort((a, b) => b.count - a.count);

  // Call drawBarChart function
  drawBarChart(data);

}).catch(error => {
  console.error("Error loading CSV file:", error);
});

// Exercise 4.6: Scaled drawBarChart function
const drawBarChart = data => {
  // 1. Quantitative Linear Scale for X-axis (TV counts)
  const xScale = d3.scaleLinear()
    .domain([0, 1200])   // Data min to max
    .range([0, 400]);     // SVG canvas space allocated (leaves space for labels)

  // 2. Categorical Band Scale for Y-axis (Brands)
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand)) // Map all unique brand names
    .range([0, 800])                // Map across available SVG height
    .paddingInner(0.2);             // Gap between bars

  // Bind data and render rectangle elements
  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", 0)
    .attr("y", d => yScale(d.brand))          // Band scale determines y position
    .attr("width", d => xScale(d.count))      // Linear scale calculates width
    .attr("height", yScale.bandwidth())       // Band scale calculates bar thickness
    .attr("fill", "#008080");                 // Color fill for bars
};
// Step 1: Append responsive SVG canvas inside the container
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
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

  // Call drawBarChart and pass the data
  drawBarChart(data);

}).catch(error => {
  console.error("Error loading CSV file:", error);
});

// Exercise 4.5: Draw bar chart function
const drawBarChart = data => {
  const barHeight = 20;  // Thickness of each bar
  const barSpacing = 5;  // Gap between bars

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", d => `bar bar-${d.count}`)  // Dynamic class assignment
    .attr("x", 0)                              // Start at left margin
    .attr("y", (d, i) => i * (barHeight + barSpacing)) // Space out vertically by index
    .attr("width", d => d.count)               // Bar length based on count data
    .attr("height", barHeight)                 // Uniform height for all bars
    .attr("fill", "#008080");                  // Color fill for bars
};
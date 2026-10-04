// Step 1: Set up responsive SVG container
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 550 800")
    .style("border", "1px solid black");

// Step 2: Load CSV data
d3.csv("data/4.4exportdata.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
}).then(data => {
  // Sort data descending by count
  data.sort((a, b) => b.count - a.count);

  drawBarChart(data);
}).catch(error => {
  console.error("Error loading CSV file:", error);
});

// Exercise 4.7: Labeled drawBarChart function
const drawBarChart = data => {
  const marginOffset = 100; // Left offset to leave room for brand labels

  // 1. Quantitative Linear Scale for X-axis (TV counts)
  const xScale = d3.scaleLinear()
    .domain([0, 1200])
    .range([0, 380]);

  // 2. Categorical Band Scale for Y-axis (Brands)
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 800])
    .paddingInner(0.25);

  // Create group containers (<g>) transformed down the y-axis
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // Append rect elements inside each group
  barAndLabel
    .append("rect")
    .attr("class", d => `bar bar-${d.count}`)
    .attr("x", marginOffset)                  // Start bars at x = 100
    .attr("y", 0)                             // Y offset handled by group translate
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#008080");

  // Append brand category text (Left side)
  barAndLabel
    .append("text")
    .text(d => d.brand)
    .attr("x", marginOffset - 10)            // Position just left of x = 100
    .attr("y", yScale.bandwidth() / 2 + 4)   // Centered vertically inside bar
    .attr("text-anchor", "end")              // Right-justify text
    .style("font-size", "12px")
    .style("font-family", "sans-serif");

  // Append count numerical value text (Right side)
  barAndLabel
    .append("text")
    .text(d => d.count)
    .attr("x", d => marginOffset + xScale(d.count) + 8) // Right past bar tip
    .attr("y", yScale.bandwidth() / 2 + 4)              // Centered vertically
    .attr("text-anchor", "start")
    .style("font-size", "11px")
    .style("font-family", "sans-serif")
    .style("fill", "#333");
};
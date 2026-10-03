// Append responsive SVG canvas inside the container
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Step 1 & 2: Load CSV data and convert count column to numbers (+d.count)
d3.csv("data/4.4exportdata.csv", d => {
  return {
    brand: d.brand,
    count: +d.count // Converts string count to a number
  };
}).then(data => {
  // Step 2: Verify in console that 'count' is imported as a number
  console.log("Loaded Data:", data);

  // Step 3: Print summary metrics
  console.log("Total Brands (length):", data.length);
  console.log("Max Count:", d3.max(data, d => d.count));
  console.log("Min Count:", d3.min(data, d => d.count));
  console.log("Extent (Min & Max):", d3.extent(data, d => d.count));

  // Sort data descending by count
  data.sort((a, b) => b.count - a.count);

  // Pass loaded data to the drawBarChart function for Exercise 4.5
  drawBarChart(data);

}).catch(error => {
  console.error("Error loading CSV file:", error);
});

// Placeholder function for Exercise 4.5
function drawBarChart(data) {
  console.log("Ready to draw bar chart with data:", data);
}
const drawDonutChart = data => {

    // ---------- Dimensions ----------
    const width = 1000;
    const height = 500;
    const padding = 40;
    const radius = Math.min(width, height) / 2 - padding;   // keeps the circle inside the svg

    // ---------- Colour scale (discrete categories, so scaleOrdinal) ----------
    const colourScale = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(d3.schemeSet2);

    // ---------- Angles ----------
    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);                  // keep the order as it appears in the table

    // ---------- Arc generator ----------
    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.6)    // 60% of max radius gives the donut hole
        .outerRadius(radius)
        .padAngle(0.02)
        .cornerRadius(4);

    // ---------- SVG container ----------
    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0, 0, ${width}, ${height}`)
        .style("border", "1px solid black");

    // ---------- Chart group, moved to the centre of the svg ----------
    const chart = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // ---------- Draw the arcs ----------
    const arcs = chart.selectAll(".arc")
        .data(pie(data))
        .join("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arcGenerator)
        .attr("fill", d => colourScale(d.data.category));

    // ---------- Labels in the middle of each slice ----------
    arcs.append("text")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(d => `${d.data.category} (${d.data.count})`);
};

// ---------- Load the data ----------
d3.csv("assets/data/Data_exercise%205.3.csv", d => ({
    category: d.Screensize_Category,
    count: +d.Count                         // string -> number
}))
.then(data => {
    console.log(data);
    drawDonutChart(data);
})
.catch(error => console.error("Error loading CSV:", error));
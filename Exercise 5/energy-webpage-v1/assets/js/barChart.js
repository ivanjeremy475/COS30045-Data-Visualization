const drawBarChart = data => {

    // ---------- Margins and dimensions ----------
    const margin = { top: 40, right: 40, bottom: 25, left: 50 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // ---------- SVG container ----------
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0, 0, ${width}, ${height}`)
        .style("border", "1px solid black");

    // ---------- Inner chart group (applies the margins) ----------
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ---------- Scales ----------
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech))
        .range([0, innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Energy_Consumption)])
        .range([innerHeight, 0]);

    // ---------- Axes ----------
    const bottomAxis = d3.axisBottom(xScale)
        .tickSizeOuter(0)
        .tickFormat(d => d.toUpperCase());

    const leftAxis = d3.axisLeft(yScale);

    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    innerChart.append("g")
        .call(leftAxis);

    // ---------- Y-axis label ----------
    innerChart.append("text")
        .text("Energy Consumption (kWh)")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .style("font-size", "14px");

    // ---------- Bars ----------
    innerChart.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
        .attr("x", d => xScale(d.Screen_Tech))
        .attr("y", d => yScale(d.Energy_Consumption));

    // ---------- Value labels above bars ----------
    innerChart.selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.Energy_Consumption) - 6)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text(d => `${Math.round(d.Energy_Consumption)} kWh`);
};

// ---------- Load, convert and sort the data ----------
d3.csv("assets/data/Data_exercise%205.1-1.csv", d => ({
    Screen_Tech: d.Screen_Tech,
    Energy_Consumption: +d["Mean(Labelled energy consumption (kWh/year))"]
}))
.then(data => {
    console.log(data);
    data.sort((a, b) => d3.descending(a.Energy_Consumption, b.Energy_Consumption));
    drawBarChart(data);
})
.catch(error => console.error("Error loading CSV:", error));
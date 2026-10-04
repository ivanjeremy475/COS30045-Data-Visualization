const drawScatterplot = data => {

    // ---------- SVG container (responsive via viewBox) ----------
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // ---------- Inner chart group (declared in shared-constants.js) ----------
    innerChartS = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ---------- Scales (declared in shared-constants.js) ----------
    xScaleS
        .domain([0, d3.max(data, d => d.star)])               // star rating on x
        .range([0, innerWidth]);

    yScaleS
        .domain([0, d3.max(data, d => d.energyConsumption)])  // energy on y
        .range([innerHeight, 0])
        .nice();

    // ---------- Circles ----------
    innerChartS.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);                                // see overlapping points

    // ---------- Axes ----------
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScaleS));

    innerChartS.append("g")
        .call(d3.axisLeft(yScaleS));

    // ---------- Axis labels ----------
    innerChartS.append("text")
        .attr("class", "axis-label")
        .text("Star Rating")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle");

    innerChartS.append("text")                                // vertical y-axis label
        .attr("class", "axis-label")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 18)
        .attr("text-anchor", "middle");

    // ---------- Legend (top right corner) ----------
    const legend = innerChartS.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${innerWidth - 70}, 5)`);

    colorScale.domain().forEach((tech, i) => {
        const item = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);    // space items 20px apart

        item.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(tech));

        item.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(tech);
    });
};
const drawHistogram = data => {

    // ---------- SVG container (responsive via viewBox) ----------
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // ---------- Inner chart group with margins ----------
    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // ---------- Bins ----------
    const bins = binGenerator(data);          // save the bins into an array
    console.log(bins);                        // check 14 arrays (one per bin)

    // ---------- Scales ----------
    const minEng = bins[0].x0;                // lower bound of the first bin
    const maxEng = bins[bins.length - 1].x1;  // upper bound of the last bin
    const binsMaxLength = d3.max(bins, d => d.length);   // tallest bin
    console.log("minEng:", minEng, "maxEng:", maxEng, "binsMaxLength:", binsMaxLength);

    xScale
        .domain([minEng, maxEng])
        .range([0, innerWidth]);

    yScale
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice();                              // round the y-axis to friendly values

    // ---------- Bars ----------
    innerChart.selectAll(".bar")
        .data(bins)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)  // gives the appearance of a gap between bars
        .attr("stroke-width", 2);

    // ---------- Axes ----------
    const bottomAxis = d3.axisBottom(xScale);
    const leftAxis = d3.axisLeft(yScale);

    innerChart.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    innerChart.append("g")
        .call(leftAxis);

    // ---------- Axis labels ----------
    innerChart.append("text")
        .attr("class", "axis-label")
        .text("Frequency")
        .attr("x", -margin.left)
        .attr("y", -15)
        .attr("text-anchor", "start");

    innerChart.append("text")
        .attr("class", "axis-label")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("x", innerWidth)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "end");
};
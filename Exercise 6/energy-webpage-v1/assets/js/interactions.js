// Exercise 6.2: filters for the histogram

const populateFilters = data => {

    // ---------- Update the histogram using the filtered data ----------
    const updateHistogram = id => {

        // "all" means no filter, otherwise keep only the chosen screen technology
        const updatedData = id === "all"
            ? data
            : data.filter(d => d.screenTech.toLowerCase() === id);

        // Re-bin the filtered data with the shared bin generator
        const updatedBins = binGenerator(updatedData);
        console.log("Filter:", id, "TVs:", updatedData.length, updatedBins);

        // Redraw the bars with a transition (xScale and yScale stay the same)
        d3.select("#histogram")
            .selectAll(".bar")
            .data(updatedBins)
            .transition()
            .duration(750)
            .ease(d3.easeCubicOut)
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", d => innerHeight - yScale(d.length));
    };

    // ---------- Build the filter buttons from the filters_screen array ----------
    d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen)
        .join("button")
        .attr("id", d => d.id)
        .text(d => d.label)
        .classed("active", d => d.isActive)
        .on("click", (event, d) => {
            console.log("Clicked:", d.id);

            // Clicking the active technology button again goes back to "all"
            const selectedId = (d.isActive && d.id !== "all") ? "all" : d.id;

            // Only one button is active at a time
            filters_screen.forEach(f => {
                f.isActive = (f.id === selectedId);
            });

            // Update the button styles to match the new state
            d3.select("#filters_screen")
                .selectAll("button")
                .classed("active", f => f.isActive);

            // Update the chart
            updateHistogram(selectedId);
        });
};

// ---------- Exercise 6.4: tooltips for the scatterplot ----------

// Create the tooltip (rectangle + text) inside the scatterplot's inner chart.
// It starts invisible and is shown by handleMouseEvents().
const createTooltip = () => {

    const tooltip = innerChartS
        .append("g")
        .attr("id", "tooltip")
        .style("opacity", 0)                  // .style (not .attr) so it overrides other formatting
        .style("pointer-events", "none");     // the tooltip never blocks the circles underneath

    // Background rectangle: same colour as the histogram bars, rounded and slightly transparent
    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 8)
        .attr("fill", barColor)
        .attr("opacity", 0.9);

    // Three lines of text: brand, model and screen size
    tooltip.append("text")
        .attr("id", "tooltip-brand")
        .attr("x", 10)
        .attr("y", 20);

    tooltip.append("text")
        .attr("id", "tooltip-model")
        .attr("x", 10)
        .attr("y", 38);

    tooltip.append("text")
        .attr("id", "tooltip-size")
        .attr("x", 10)
        .attr("y", 56);

    tooltip.selectAll("text")
        .style("fill", "white")
        .style("font-size", "12px");
};

// Show and hide the tooltip when the mouse enters and leaves a circle
const handleMouseEvents = () => {

    const tooltip = d3.select("#tooltip");

    // Cut long model names so they fit inside the tooltip
    const shorten = (text, max) => text.length > max ? text.slice(0, max - 1) + "…" : text;

    d3.select("#scatterplot")
        .selectAll(".dot")
        .on("mouseenter", (event, d) => {
            console.log("mouseenter", event, d);

            const circle = event.currentTarget;
            const cx = +circle.getAttribute("cx");     // circle centre, already in chart coordinates
            const cy = +circle.getAttribute("cy");

            // Fill in the text
            tooltip.select("#tooltip-brand").text(`Brand: ${d.brand}`);
            tooltip.select("#tooltip-model").text(`Model: ${shorten(d.model, 20)}`);
            tooltip.select("#tooltip-size").text(`Screen size: ${d.screenSize} inch`);

            // Position: above-right of the circle, flipped if it would leave the chart
            let x = cx + 10;
            let y = cy - tooltipHeight - 10;
            if (x + tooltipWidth > innerWidth) x = cx - tooltipWidth - 10;
            if (y < 0) y = cy + 10;

            tooltip
                .attr("transform", `translate(${x}, ${y})`)
                .transition()
                .duration(200)
                .style("opacity", 1);

            // Highlight the circle being hovered
            d3.select(circle)
                .attr("opacity", 1)
                .attr("r", 5);
        })
        .on("mouseleave", (event, d) => {
            console.log("mouseleave", d);

            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
                .on("end", () => tooltip.attr("transform", "translate(-1000, -1000)"));   // park it out of the way

            // Return the circle to normal
            d3.select(event.currentTarget)
                .attr("opacity", 0.5)
                .attr("r", 3);
        });
};
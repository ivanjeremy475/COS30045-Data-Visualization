// Load the CSV file with a row conversion function
d3.csv("assets/data/Ex6_TVdata_withStar.csv", d => ({
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,                 // convert to number
    screenTech: d.screenTech,
    energyConsumption: +d.energyConsumption,   // convert to number
    star: +d.star                              // convert to number
}))
.then(data => {
    // Log the processed data to the console
    console.log(data);

    // Call functions after data is loaded
    drawHistogram(data);
    drawScatterplot(data);                     // Exercise 6.3
    populateFilters(data);                     // defined in interactions.js (Exercise 6.2)
    createTooltip();                           // Exercise 6.4 (placeholder for now)
    handleMouseEvents();                       // Exercise 6.4 (placeholder for now)
})
.catch(error => {
    console.error("Error loading the CSV file:", error);
});
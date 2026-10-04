// Set up dimensions and margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;     // total width of the chart
const height = 400;    // total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Set up colours accessible globally
const barColor = "#147d7d";
const bodyBackgroundColor = "#ffffff";

// Set up the scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Create a bin generator using d3.bin
// The domain and thresholds are fixed (14 bins of 200 kWh from 0 to 2800) so the bin
// edges stay the same when the data is filtered. Only the bar heights change.
const binGenerator = d3.bin()
    .value(d => d.energyConsumption)           // accessor for energyConsumption
    .domain([0, 2800])
    .thresholds(d3.range(200, 2800, 200));

// Filter buttons: id (used in code), label (shown to users) and starting state
const filters_screen = [
    { id: "all",  label: "All",  isActive: true  },
    { id: "lcd",  label: "LCD",  isActive: false },
    { id: "led",  label: "LED",  isActive: false },
    { id: "oled", label: "OLED", isActive: false }
];

// ---------- Exercise 6.3: scatterplot constants ----------
// innerChartS is assigned in scatterplot.js once the svg exists.
// The "S" keeps it separate from the histogram's inner chart.
let innerChartS;

// Scales for the scatterplot (S = scatterplot)
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Size of the tooltip (used in Exercise 6.4)
const tooltipWidth = 180;
const tooltipHeight = 66;

// Colour scale: different hues for different categories (screen type)
const colorScale = d3.scaleOrdinal()
    .domain(["LCD", "LED", "OLED"])
    .range(["#E69F00", "#0072B2", "#CC79A7"]);   // colour-blind friendly hues
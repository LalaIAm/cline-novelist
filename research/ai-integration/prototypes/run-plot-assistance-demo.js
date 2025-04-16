/**
 * Run Plot Assistance Demo
 * 
 * This script runs the plot assistance prototype
 * with sample data to demonstrate its capabilities.
 */

const { runPlotAssistanceDemo } = require('./plot-assistance-prototype');

console.log("=== Plot Assistance Demo ===");
console.log("This demo shows how AI can help with plot analysis and development");
console.log("by identifying plot holes, suggesting structural improvements,");
console.log("and offering specific solutions based on genre conventions.\n");

// Run the demo
runPlotAssistanceDemo()
  .then(result => {
    console.log("\nDemo completed successfully!");
    process.exit(0);
  })
  .catch(error => {
    console.error("Demo failed with error:", error);
    process.exit(1);
  });

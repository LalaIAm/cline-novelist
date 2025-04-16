/**
 * Run Character Development Demo
 * 
 * This script runs the character development assistance prototype
 * with sample data to demonstrate its capabilities.
 */

const { runCharacterDevelopmentDemo } = require('./character-development-assistance');

console.log("=== Character Development Assistance Demo ===");
console.log("This demo shows how AI can help with character development");
console.log("by providing detailed suggestions based on character profiles");
console.log("and relevant passages from the manuscript.\n");

// Run the demo
runCharacterDevelopmentDemo()
  .then(result => {
    console.log("\nDemo completed successfully!");
    process.exit(0);
  })
  .catch(error => {
    console.error("Demo failed with error:", error);
    process.exit(1);
  });

// State management
let isCommandActive = false;
let frozenTooltips = [];

// Main keyboard handler
document.addEventListener("keydown", function (event) {
  // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
  if ((event.metaKey || event.ctrlKey) && event.key === "k") {
    event.preventDefault();

    if (isCommandActive) {
      deactivateCommandMode();
    } else {
      activateCommandMode();
    }
  }
});

function activateCommandMode() {
  console.log("Command mode activated");
  isCommandActive = true;

  // 1. Capture all visible tooltips on the page
  captureVisibleTooltips();

  // 2. Create visual indicator that command mode is active
  createCommandIndicator();
}

function deactivateCommandMode() {
  console.log("Command mode deactivated");
  isCommandActive = false;

  // Remove indicator
  const indicator = document.getElementById("command-indicator");
  if (indicator) indicator.remove();

  // Remove any frozen tooltip clones
  document.querySelectorAll(".frozen-tooltip").forEach((el) => el.remove());

  // Clear frozen tooltips
  frozenTooltips = [];
}

function captureVisibleTooltips() {
  // Method 1: Find all elements with visible tooltips (custom implementation)
  document
    .querySelectorAll(
      "[data-tooltip]:hover, .tooltip:hover, [aria-describedby]:hover"
    )
    .forEach((el) => {
      const tooltipData = {
        element: el,
        position: {
          top: el.getBoundingClientRect().top,
          left: el.getBoundingClientRect().left,
        },
      };
      frozenTooltips.push(tooltipData);
    });

  // Method 2: Create copies of all tooltip elements currently visible
  document
    .querySelectorAll('.tooltip:not(.hidden), [role="tooltip"]:not(.hidden)')
    .forEach((tooltip) => {
      // Clone the tooltip
      const clone = tooltip.cloneNode(true);
      clone.classList.add("frozen-tooltip");

      // Position it exactly where the original is
      const rect = tooltip.getBoundingClientRect();
      clone.style.position = "fixed";
      clone.style.top = rect.top + "px";
      clone.style.left = rect.left + "px";
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.zIndex = "10000";

      // Add to document
      document.body.appendChild(clone);

      frozenTooltips.push({
        originalElement: tooltip,
        cloneElement: clone,
      });
    });

  console.log(
    "Captured tooltips:",
    frozenTooltips.length > 0 ? frozenTooltips : "None found"
  );
}

function createCommandIndicator() {
  const indicator = document.createElement("div");
  indicator.id = "command-indicator";
  indicator.style.position = "fixed";
  indicator.style.bottom = "20px";
  indicator.style.right = "20px";
  indicator.style.padding = "8px 12px";
  indicator.style.backgroundColor = "#333";
  indicator.style.color = "#fff";
  indicator.style.borderRadius = "4px";
  indicator.style.zIndex = "10001";
  indicator.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  indicator.style.fontSize = "14px";

  indicator.textContent = "Command Mode Active (Press Cmd+K to exit)";

  document.body.appendChild(indicator);
}

// Helper function to create a test tooltip
function createTestTooltip() {
  // Create a button that shows a tooltip on hover
  const button = document.createElement("button");
  button.textContent = "Hover over me";
  button.style.position = "fixed";
  button.style.top = "100px";
  button.style.left = "100px";
  button.style.padding = "10px";

  // Create the tooltip
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.textContent = "This is a tooltip";
  tooltip.style.position = "absolute";
  tooltip.style.top = "40px";
  tooltip.style.left = "0";
  tooltip.style.backgroundColor = "#222";
  tooltip.style.color = "#fff";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.display = "none";
  tooltip.style.zIndex = "1000";

  button.appendChild(tooltip);

  // Show/hide tooltip on hover
  button.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";
  });

  button.addEventListener("mouseleave", () => {
    if (!isCommandActive) {
      tooltip.style.display = "none";
    }
  });

  document.body.appendChild(button);

  console.log(
    "Test tooltip created. Hover over the button and press Cmd+K to freeze it."
  );
}

// Run this to create a test tooltip
// createTestTooltip();

console.log(
  "Tooltip freeze utility loaded. Press Cmd+K to toggle command mode."
);
console.log("To test with a sample tooltip, run: createTestTooltip()");

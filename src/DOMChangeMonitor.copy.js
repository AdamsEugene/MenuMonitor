// Object to store all changes
const allChanges = new Map();

// Variable to track if we're currently recording changes
let isRecording = false;

// Variable to store the root element we're monitoring
let monitoredRootElement = null;

// Variable to store the timer
let recordingTimer = null;

// Function to generate a unique identifier for an element
function getElementIdentifier(element) {
  return element;
}

// Function to find the nearest nav ancestor
function findNearestNavAncestor(element) {
  while (element && element !== document.body) {
    if (element.tagName.toLowerCase() === "nav") {
      return element;
    }
    element = element.parentElement;
  }
  return null; // Return null if no nav ancestor is found
}

// Function to get all styles of an element
function getAllStyles(element) {
  const computedStyle = window.getComputedStyle(element);
  const targetStyles = ["display", "opacity", "visibility", "transform"];
  const styles = {};

  targetStyles.forEach((prop) => {
    const value = computedStyle.getPropertyValue(prop);
    if (value !== "") {
      styles[prop] = value;
    }
  });

  return styles;
}

// Function to report and store changes
function reportAndStoreChange(mutation) {
  if (!isRecording) return;

  const targetId = getElementIdentifier(mutation.target);
  if (!allChanges.has(targetId)) {
    allChanges.set(targetId, []);
  }

  let changeDetails;
  switch (mutation.type) {
    case "attributes":
      if (mutation.attributeName === "style") {
        changeDetails = {
          type: "style",
          oldValue: getAllStyles(mutation.target),
          newValue: getAllStyles(mutation.target),
        };
      } else {
        changeDetails = {
          type: "attributes",
          attributeName: mutation.attributeName,
          oldValue: mutation.oldValue,
          newValue: mutation.target.getAttribute(mutation.attributeName),
        };
      }
      break;
    case "childList":
      changeDetails = {
        type: "childList",
        addedNodes: Array.from(mutation.addedNodes)
          .map((n) =>
            n.nodeType === Node.ELEMENT_NODE ? getElementIdentifier(n) : null
          )
          .filter(Boolean),
        removedNodes: Array.from(mutation.removedNodes)
          .map((n) =>
            n.nodeType === Node.ELEMENT_NODE ? getElementIdentifier(n) : null
          )
          .filter(Boolean),
      };
      break;
    case "characterData":
      changeDetails = {
        type: "characterData",
        oldValue: mutation.oldValue,
        newValue: mutation.target.textContent,
      };
      break;
  }

  allChanges.get(targetId).push(changeDetails);
  console.log(
    `Change recorded for ${targetId}:`,
    JSON.stringify(changeDetails, null, 2)
  );
}

// Create a MutationObserver instance
const _observer = new MutationObserver((mutations) => {
  mutations.forEach(reportAndStoreChange);
});

// Configure the _observer
const config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
};

// Function to start recording changes after a delay
function startRecordingWithDelay(event) {
  if (recordingTimer) {
    clearTimeout(recordingTimer);
  }

  monitoredRootElement = findNearestNavAncestor(event.target);

  if (!monitoredRootElement) {
    console.log("No nav ancestor found. Not starting recording.");
    return;
  }

  recordingTimer = setTimeout(() => {
    allChanges.clear(); // Clear previous recordings
    isRecording = true;
    _observer.observe(monitoredRootElement, config);
    captureInitialState(monitoredRootElement);
    console.log("Started recording changes for nav:", monitoredRootElement);
  }, 5000); // 5000ms delay
}

// Function to capture initial state of elements
function captureInitialState(element) {
  const elementId = getElementIdentifier(element);
  console.log(getAllStyles(element));

  allChanges.set(elementId, [
    {
      type: "initial",
      attributes: Array.from(element.attributes).map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),
      style: getAllStyles(element),
      children: Array.from(element.children).map((child) =>
        getElementIdentifier(child)
      ),
      textContent:
        element.childNodes.length === 1 &&
        element.childNodes[0].nodeType === Node.TEXT_NODE
          ? element.textContent
          : null,
    },
  ]);
  console.log(`Captured initial state for: `, elementId);

  for (let child of element.children) {
    captureInitialState(child);
  }
}

// Function to stop recording changes
function stopRecording() {
  if (recordingTimer) {
    clearTimeout(recordingTimer);
    recordingTimer = null;
  }

  if (isRecording) {
    isRecording = false;
    _observer.disconnect();
    console.log("Stopped recording changes");
    console.log("Final recorded changes:", allChanges);
  }
}

// Function to replay changes
function replayChanges() {
  console.log("Replaying changes...");
  for (let [elementId, changes] of allChanges) {
    changes.forEach((change, index) => {
      setTimeout(() => {
        applyChange(elementId, change);
      }, 1);
    });
  }
}

// Function to apply a single change
function applyChange(elementId, change) {
  const element = elementId;
  if (!element) {
    console.warn(`Element not found: ${elementId}`);
    return;
  }

  let displayValue = null;

  switch (change.type) {
    case "initial":
      // Reset to initial state
      change.attributes.forEach((attr) => {
        element.setAttribute(attr.name, attr.value + " adams");
      });
      Object.entries(change.style).forEach(([prop, value]) => {
        if (prop === "display") {
          displayValue = value;
        } else {
          element.style.setProperty(prop, value, "important");
        }
      });
      if (change.textContent !== null) {
        element.textContent = change.textContent;
      }
      break;
    case "attributes":
      if (change.attributeName === "class") {
        element.className = change.newValue;
      } else {
        element.setAttribute(change.attributeName, change.newValue);
      }
      break;
    case "style":
      Object.entries(change.newValue).forEach(([prop, value]) => {
        if (prop === "display") {
          displayValue = value;
        } else {
          element.style.setProperty(prop, value, "important");
        }
      });
      break;
    case "childList":
      change.addedNodes.forEach((node) => {
        if (!element.contains(node)) {
          element.appendChild(node);
        }
      });
      change.removedNodes.forEach((node) => {
        if (element.contains(node)) {
          element.removeChild(node);
        }
      });
      break;
    case "characterData":
      element.textContent = change.newValue;
      break;
  }

  // Handle display property separately
  if (displayValue !== null) {
    const uniqueId = "display-rule-" + Math.random().toString(36).substr(2, 9);
    element.id = uniqueId;

    // Create or update style rule
    let styleSheet = document.styleSheets[0];
    if (!styleSheet) {
      const style = document.createElement("style");
      document.head.appendChild(style);
      styleSheet = style.sheet;
    }

    const ruleText = `#${uniqueId} { display: ${displayValue} !important; }`;
    styleSheet.insertRule(ruleText, styleSheet.cssRules.length);
  }

  console.log(`Applied change to:`, element, change);
}

// Function to clear all changes
function clearChanges() {
  console.log("Clearing all changes...");

  // Iterate through all changed elements
  for (let [elementId, changes] of allChanges) {
    const element = elementId;
    if (!element || !element.isConnected) {
      console.warn(`Element not found or not in document: ${elementId}`);
      continue;
    }

    // Revert to original state
    changes.forEach((change) => {
      try {
        switch (change.type) {
          case "initial":
            // Restore initial attributes
            change.attributes.forEach((attr) => {
              try {
                element.setAttribute(attr.name, attr.value);
              } catch (e) {
                console.warn(`Failed to restore attribute: ${attr.name}`, e);
              }
            });
            // Restore initial styles
            Object.entries(change.style).forEach(([prop, value]) => {
              try {
                element.style.setProperty(prop, value);
              } catch (e) {
                console.warn(`Failed to restore style: ${prop}`, e);
              }
            });
            // Restore initial text content
            if (change.textContent !== null) {
              element.textContent = change.textContent;
            }
            break;
          case "attributes":
            if (change.oldValue === null) {
              element.removeAttribute(change.attributeName);
            } else {
              element.setAttribute(change.attributeName, change.oldValue);
            }
            break;
          case "style":
            Object.entries(change.oldValue).forEach(([prop, value]) => {
              element.style.setProperty(prop, value);
            });
            break;
          case "childList":
            // We'll skip childList changes as they're complex and error-prone
            console.log("Skipping childList change for safety");
            break;
          case "characterData":
            if (element.nodeType === Node.TEXT_NODE) {
              element.textContent = change.oldValue;
            }
            break;
        }
      } catch (error) {
        console.error(`Error applying change:`, error, change);
      }
    });

    // Remove any added IDs
    if (element.id && element.id.startsWith("display-rule-")) {
      element.removeAttribute("id");
    }
  }

  // Remove any style rules we've added
  try {
    let styleSheet = document.styleSheets[0];
    if (styleSheet) {
      for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        if (
          styleSheet.cssRules[i].selectorText &&
          styleSheet.cssRules[i].selectorText.startsWith("#display-rule-")
        ) {
          styleSheet.deleteRule(i);
        }
      }
    }
  } catch (error) {
    console.error("Error removing style rules:", error);
  }

  // Clear our changes record
  allChanges.clear();

  console.log("All changes have been cleared and original states restored.");
}

// Add event listeners to the document for automatic recording
document.addEventListener("mouseover", startRecordingWithDelay);
document.addEventListener("mouseout", stopRecording);

// Example usage:
// Hover over any element within a nav for at least 5 seconds to start recording changes
// Move the mouse out to stop recording
// Call replayChanges() when you want to replay the recorded changes and restore the hovered state
// Call clearChanges() when you want to revert all changes and restore original states

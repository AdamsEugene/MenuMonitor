class DOMChangeMonitor {
  navElement = null;
  headerElement = null;

  constructor() {
    this.allChanges = new Map();
    this.isRecording = false;
    this.monitoredRootElement = null;
    this.recordingTimer = null;
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.config = {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    };
  }

  init(containerId = "recordingPlayer") {
    const document = window.document;
    const iframe = document.getElementById(containerId);
    const dom = iframe?.contentWindow?.document || document;

    const headers = dom.querySelectorAll("header");
    const header = Array.from(headers).filter((header) =>
      this.isElementVisible(header)
    )[0];

    if (!header) {
      console.error("Error: No header element found.");
      this.headerElement = null;
      return;
    }

    let currentElement = header;
    let parentElement = currentElement.parentElement;

    while (
      parentElement &&
      this.hasSamePositionSize(currentElement, parentElement)
    ) {
      currentElement = parentElement;
      parentElement = currentElement.parentElement;
    }

    this.headerElement = currentElement;

    if (this.headerElement) {
      this.attachReopenMenuListener();
      this.navElement = this.getVisibleNavElements(this.headerElement)[0];
      console.log("nav: ", this.navElement);

      if (this.navElement) {
        this.navElement.addEventListener(
          "mouseover",
          this.startRecordingWithDelay.bind(this)
        );
        this.navElement.addEventListener(
          "mouseout",
          this.stopRecording.bind(this)
        );
      }
    }
  }

  attachReopenMenuListener() {
    // Add new event listeners
    document.addEventListener("reopen-menu", this.handleReopenMenu.bind(this));
    document.addEventListener("close-menu", this.handleCloseMenu.bind(this));
  }

  hasSamePositionSize(ele1, ele2) {
    const rect1 = ele1.getBoundingClientRect();
    const rect2 = ele2.getBoundingClientRect();

    return (
      rect1.top === rect2.top &&
      rect1.right === rect2.right &&
      rect1.bottom === rect2.bottom &&
      rect1.left === rect2.left
    );
  }

  isElementVisible(element) {
    const computedStyles = window.getComputedStyle(element);
    return (
      computedStyles.display !== "none" &&
      computedStyles.visibility !== "hidden"
    );
  }

  getVisibleNavElements(container) {
    if (!container) return [];
    const navElements = container.querySelectorAll("nav");
    if (!navElements) return [container];
    const visibleNavElements = Array.from(navElements).filter((element) => {
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    });
    return visibleNavElements.length > 0 ? visibleNavElements : [container];
  }

  handleMutations(mutations) {
    mutations.forEach(this.reportAndStoreChange.bind(this));
  }

  getElementIdentifier(element) {
    return element;
  }

  findNearestNavAncestor(element) {
    while (element && element !== document.body) {
      if (element.tagName.toLowerCase() === "nav") {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }

  getAllStyles(element) {
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

  reportAndStoreChange(mutation) {
    if (!this.isRecording) return;

    const targetId = this.getElementIdentifier(mutation.target);
    if (!this.allChanges.has(targetId)) {
      this.allChanges.set(targetId, []);
    }

    let changeDetails;
    switch (mutation.type) {
      case "attributes":
        if (mutation.attributeName === "style") {
          changeDetails = {
            type: "style",
            oldValue: this.getAllStyles(mutation.target),
            newValue: this.getAllStyles(mutation.target),
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
              n.nodeType === Node.ELEMENT_NODE
                ? this.getElementIdentifier(n)
                : null
            )
            .filter(Boolean),
          removedNodes: Array.from(mutation.removedNodes)
            .map((n) =>
              n.nodeType === Node.ELEMENT_NODE
                ? this.getElementIdentifier(n)
                : null
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

    this.allChanges.get(targetId).push(changeDetails);
    console.log(
      `Change recorded for ${targetId}:`,
      JSON.stringify(changeDetails, null, 2)
    );
  }

  startRecordingWithDelay(event) {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
    }

    this.monitoredRootElement = this.findNearestNavAncestor(event.target);

    if (!this.monitoredRootElement) {
      console.log("No nav ancestor found. Not starting recording.");
      return;
    }

    this.recordingTimer = setTimeout(() => {
      this.allChanges.clear();
      this.isRecording = true;
      this.observer.observe(this.monitoredRootElement, this.config);
      this.captureInitialState(this.monitoredRootElement);
      console.log(
        "Started recording changes for nav:",
        this.monitoredRootElement
      );
    }, 5000);
  }

  captureInitialState(element) {
    const elementId = this.getElementIdentifier(element);
    console.log(this.getAllStyles(element));

    this.allChanges.set(elementId, [
      {
        type: "initial",
        attributes: Array.from(element.attributes).map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
        style: this.getAllStyles(element),
        children: Array.from(element.children).map((child) =>
          this.getElementIdentifier(child)
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
      this.captureInitialState(child);
    }
  }

  stopRecording() {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.isRecording) {
      this.isRecording = false;
      this.observer.disconnect();
      console.log("Stopped recording changes");
      console.log("Final recorded changes:", this.allChanges);
    }
  }

  replayChanges() {
    console.log("Replaying changes...");
    for (let [elementId, changes] of this.allChanges) {
      changes.forEach((change, index) => {
        setTimeout(() => {
          this.applyChange(elementId, change);
        }, 1);
      });
    }
  }

  applyChange(elementId, change) {
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
      const uniqueId =
        "display-rule-" + Math.random().toString(36).substr(2, 9);
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

  clearChanges() {
    console.log("Clearing all changes...");

    // Iterate through all changed elements
    for (let [elementId, changes] of this.allChanges) {
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
    this.allChanges.clear();

    console.log("All changes have been cleared and original states restored.");
  }

  handleReopenMenu(event) {
    console.log("Reopening menu");
    this.replayChanges(); // This is a simple implementation; you might need more specific logic
  }

  handleCloseMenu(event) {
    console.log("Closing menu");
    this.clearChanges(); // This is a simple implementation; you might need more specific logic
  }

  reopenMenu() {
    document.dispatchEvent(new CustomEvent("reopen-menu", { detail: true }));
  }

  closeMenu() {
    document.dispatchEvent(new CustomEvent("close-menu", { detail: true }));
  }
}

// Usage
const domMonitor = new DOMChangeMonitor();
domMonitor.init();

// Example usage:
// Hover over any element within a nav for at least 5 seconds to start recording changes
// Move the mouse out to stop recording
// Call domMonitor.replayChanges() when you want to replay the recorded changes
// Call domMonitor.clearChanges() when you want to revert all changes

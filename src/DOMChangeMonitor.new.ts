// Define interfaces
interface Change {
  type: string;
  [key: string]: any;
}

interface InitialChange extends Change {
  type: "initial";
  attributes: Array<{ name: string; value: string }>;
  style: { [key: string]: string };
  children: Element[];
  textContent: string | null;
}

interface AttributeChange extends Change {
  type: "attributes";
  attributeName: string;
  oldValue: string | null;
  newValue: string | null;
}

interface StyleChange extends Change {
  type: "style";
  oldValue: { [key: string]: string };
  newValue: { [key: string]: string };
}

interface ChildListChange extends Change {
  type: "childList";
  addedNodes: Element[];
  removedNodes: Element[];
}

interface CharacterDataChange extends Change {
  type: "characterData";
  oldValue: string | null;
  newValue: string;
}

class DOMChangeMonitor {
  private navElement: Element | null = null;
  private headerElement: Element | null = null;
  private allChanges: Map<Element, Change[]> = new Map();
  private isRecording: boolean = false;
  private monitoredRootElement: Element | null = null;
  private recordingTimer: number | null = null;
  private observer: MutationObserver;
  private config: MutationObserverInit;
  private dom: Document;

  constructor() {
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

  init(containerId: string = "recordingPlayer"): void {
    const document = window.document;
    const iframe = document.getElementById(
      containerId
    ) as HTMLIFrameElement | null;
    this.dom = iframe?.contentWindow?.document || document;

    const headers = this.dom.querySelectorAll("header");
    const header = Array.from(headers).filter((header) =>
      this.isElementVisible(header)
    )[0];

    if (!header) {
      console.error("Error: No header element found.");
      this.headerElement = null;
      return;
    }

    let currentElement: Element = header;
    let parentElement: Element | null = currentElement.parentElement;

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

  private attachReopenMenuListener(): void {
    document.addEventListener("reopen-menu", this.handleReopenMenu.bind(this));
    document.addEventListener("close-menu", this.handleCloseMenu.bind(this));
  }

  private hasSamePositionSize(ele1: Element, ele2: Element): boolean {
    const rect1 = ele1.getBoundingClientRect();
    const rect2 = ele2.getBoundingClientRect();

    return (
      rect1.top === rect2.top &&
      rect1.right === rect2.right &&
      rect1.bottom === rect2.bottom &&
      rect1.left === rect2.left
    );
  }

  private isElementVisible(element: Element): boolean {
    const computedStyles = window.getComputedStyle(element);
    return (
      computedStyles.display !== "none" &&
      computedStyles.visibility !== "hidden"
    );
  }

  private getVisibleNavElements(container: Element): Element[] {
    if (!container) return [];
    const navElements = container.querySelectorAll("nav");
    if (!navElements) return [container];
    const visibleNavElements = Array.from(navElements).filter((element) => {
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    });
    return visibleNavElements.length > 0 ? visibleNavElements : [container];
  }

  private handleMutations(mutations: MutationRecord[]): void {
    mutations.forEach(this.reportAndStoreChange.bind(this));
  }

  private getElementIdentifier(element: Element): Element {
    return element;
  }

  private findNearestNavAncestor(element: Element): Element | null {
    while (element && element !== document.body) {
      if (element.tagName.toLowerCase() === "nav") {
        return element;
      }
      element = element.parentElement!;
    }
    return null;
  }

  private getAllStyles(element: Element): { [key: string]: string } {
    const computedStyle = window.getComputedStyle(element);
    const targetStyles = ["display", "opacity", "visibility", "transform"];
    const styles: { [key: string]: string } = {};

    targetStyles.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value !== "") {
        styles[prop] = value;
      }
    });

    return styles;
  }

  private reportAndStoreChange(mutation: MutationRecord): void {
    if (!this.isRecording) return;

    const targetId = this.getElementIdentifier(mutation.target as Element);
    if (!this.allChanges.has(targetId)) {
      this.allChanges.set(targetId, []);
    }

    let changeDetails: Change;
    switch (mutation.type) {
      case "attributes":
        if (mutation.attributeName === "style") {
          changeDetails = {
            type: "style",
            oldValue: this.getAllStyles(mutation.target as Element),
            newValue: this.getAllStyles(mutation.target as Element),
          };
        } else {
          changeDetails = {
            type: "attributes",
            attributeName: mutation.attributeName!,
            oldValue: mutation.oldValue,
            newValue: (mutation.target as Element).getAttribute(
              mutation.attributeName!
            ),
          };
        }
        break;
      case "childList":
        changeDetails = {
          type: "childList",
          addedNodes: Array.from(mutation.addedNodes)
            .filter((n): n is Element => n.nodeType === Node.ELEMENT_NODE)
            .map(this.getElementIdentifier),
          removedNodes: Array.from(mutation.removedNodes)
            .filter((n): n is Element => n.nodeType === Node.ELEMENT_NODE)
            .map(this.getElementIdentifier),
        };
        break;
      case "characterData":
        changeDetails = {
          type: "characterData",
          oldValue: mutation.oldValue,
          newValue: mutation.target.textContent!,
        };
        break;
      default:
        return;
    }

    this.allChanges.get(targetId)!.push(changeDetails);
    // console.log(`Change recorded for: `, targetId);
  }

  private startRecordingWithDelay(event: MouseEvent): void {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
    }

    this.monitoredRootElement = this.findNearestNavAncestor(
      event.target as Element
    );

    if (!this.monitoredRootElement) {
      console.log("No nav ancestor found. Not starting recording.");
      return;
    }

    this.recordingTimer = window.setTimeout(() => {
      this.allChanges.clear();
      this.isRecording = true;
      this.observer.observe(this.monitoredRootElement!, this.config);
      this.captureInitialState(this.monitoredRootElement!);
      console.log(
        "Started recording changes for nav:",
        this.monitoredRootElement
      );
    }, 3000);
  }

  private captureInitialState(element: Element): void {
    const elementId = this.getElementIdentifier(element);
    console.log(this.getAllStyles(element));

    const initialChange: InitialChange = {
      type: "initial",
      attributes: Array.from(element.attributes).map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),
      style: this.getAllStyles(element),
      children: Array.from(element.children),
      textContent:
        element.childNodes.length === 1 &&
        element.childNodes[0].nodeType === Node.TEXT_NODE
          ? element.childNodes[0].textContent
          : null,
    };

    this.allChanges.set(elementId, [initialChange]);
    console.log(`Captured initial state for: `, elementId);

    Array.from(element.children).forEach((child) => {
      this.captureInitialState(child);
    });
  }

  private stopRecording(): void {
    if (this.recordingTimer) {
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.isRecording) {
      this.isRecording = false;
      this.observer.disconnect();
      console.log("Stopped recording changes", this.allChanges.size);
      // console.log("Final recorded changes:", this.allChanges);
    }
  }

  public replayChanges(): void {
    console.log("Replaying changes...");
    Array.from(this.allChanges.entries()).forEach(([elementId, changes]) => {
      changes.forEach((change, index) => {
        setTimeout(() => {
          this.applyChange(elementId, change);
        }, 1);
      });
    });
  }

  private applyChange(elementId: Element, change: Change): void {
    const element = elementId as HTMLElement;
    if (!element) {
      console.warn(`Element not found: ${elementId}`);
      return;
    }

    switch (change.type) {
      case "initial":
        // Reset to initial state
        (change as InitialChange).attributes.forEach((attr) => {
          element.setAttribute(attr.name, attr.value + " adams");
        });
        Object.entries((change as InitialChange).style).forEach(
          ([prop, value]) => {
            if (prop === "display") {
              element.style.setProperty("display", value, "important");
              this.setDisplay(element, value);
            } else {
              element.style.setProperty(prop, value, "important");
            }
          }
        );
        if ((change as InitialChange).textContent !== null) {
          element.textContent = (change as InitialChange).textContent;
        }
        break;
      case "attributes":
        if ((change as AttributeChange).attributeName === "class") {
          element.className = (change as AttributeChange).newValue || "";
        } else {
          element.setAttribute(
            (change as AttributeChange).attributeName,
            (change as AttributeChange).newValue || ""
          );
        }
        break;
      case "style":
        Object.entries((change as StyleChange).newValue).forEach(
          ([prop, value]) => {
            if (prop === "display") {
              element.style.setProperty("display", value, "important");
              this.setDisplay(element, value);
            } else {
              element.style.setProperty(prop, value, "important");
            }
          }
        );
        break;
      case "childList":
        (change as ChildListChange).addedNodes.forEach((node) => {
          if (!element.contains(node)) {
            element.appendChild(node);
          }
        });
        (change as ChildListChange).removedNodes.forEach((node) => {
          if (element.contains(node)) {
            element.removeChild(node);
          }
        });
        break;
      case "characterData":
        element.textContent = (change as CharacterDataChange).newValue;
        break;
    }

    // function setDisplay(element: HTMLElement, displayValue: string) {
    //   const uniqueId =
    //     "display-rule-" + Math.random().toString(36).substr(2, 9);
    //   element.id = uniqueId;

    //   let styleSheet = document.styleSheets[0] as CSSStyleSheet;
    //   if (!styleSheet) {
    //     const style = document.createElement("style");
    //     document.head.appendChild(style);
    //     styleSheet = style.sheet as CSSStyleSheet;
    //   }

    //   const ruleText = `#${uniqueId} { display: ${displayValue} !important; }`;
    //   styleSheet.insertRule(ruleText, styleSheet.cssRules.length);
    // }
    console.log(`Applied change to:`, element, change);
  }

  private setDisplay(element: HTMLElement, displayValue: string) {
    const uniqueId = "display-rule-" + Math.random().toString(36).substr(2, 9);
    element.id = uniqueId;

    // Apply the display style directly to the element
    element.style.setProperty("display", displayValue, "important");

    // Add a data attribute for easier identification
    element.setAttribute("data-display-rule", "true");

    // Create a style element for this specific rule
    const styleElement = this.dom.createElement("style");
    styleElement.textContent = `#${uniqueId} { display: ${displayValue} !important; }`;
    this.dom.head.appendChild(styleElement);
  }

  public clearChanges(): void {
    console.log("Clearing all changes...");

    // Iterate through all changed elements
    Array.from(this.allChanges.entries()).forEach(([elementId, changes]) => {
      const element = elementId as HTMLElement;
      if (!element || !element.isConnected) {
        console.warn(`Element not found or not in document: ${elementId}`);
        return;
      }

      // Revert to original state
      changes.forEach((change: Change) => {
        try {
          switch (change.type) {
            case "initial":
              // Restore initial attributes
              (change as InitialChange).attributes.forEach((attr) => {
                try {
                  element.setAttribute(attr.name, attr.value);
                } catch (e) {
                  console.warn(`Failed to restore attribute: ${attr.name}`, e);
                }
              });
              // Restore initial styles
              Object.entries((change as InitialChange).style).forEach(
                ([prop, value]) => {
                  try {
                    element.style.setProperty(prop, value);
                  } catch (e) {
                    console.warn(`Failed to restore style: ${prop}`, e);
                  }
                }
              );
              // Restore initial text content
              if ((change as InitialChange).textContent !== null) {
                element.textContent = (change as InitialChange).textContent;
              }
              break;
            case "attributes":
              if ((change as AttributeChange).oldValue === null) {
                element.removeAttribute(
                  (change as AttributeChange).attributeName
                );
              } else {
                element.setAttribute(
                  (change as AttributeChange).attributeName,
                  (change as AttributeChange).oldValue!
                );
              }
              break;
            case "style":
              Object.entries((change as StyleChange).oldValue).forEach(
                ([prop, value]) => {
                  element.style.setProperty(prop, value);
                }
              );
              break;
            case "childList":
              // We'll skip childList changes as they're complex and error-prone
              console.log("Skipping childList change for safety");
              break;
            case "characterData":
              if (element.nodeType === Node.TEXT_NODE) {
                element.textContent = (change as CharacterDataChange).oldValue;
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
    });

    // Remove any style rules we've added
    try {
      let styleSheet = document.styleSheets[0] as CSSStyleSheet;
      if (styleSheet) {
        for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
          const rule = styleSheet.cssRules[i];
          if (
            rule instanceof CSSStyleRule &&
            rule.selectorText &&
            rule.selectorText.startsWith("#display-rule-")
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

  private handleReopenMenu(event: Event): void {
    console.log("Reopening menu");
    this.replayChanges(); // This is a simple implementation; you might need more specific logic
  }

  private handleCloseMenu(event: Event): void {
    console.log("Closing menu");
    this.clearChanges(); // This is a simple implementation; you might need more specific logic
  }

  public reopenMenu(): void {
    document.dispatchEvent(new CustomEvent("reopen-menu", { detail: true }));
  }

  public closeActiveMenu(): void {
    document.dispatchEvent(new CustomEvent("close-menu", { detail: true }));
  }
}

function createInstance<T>(
  constructor: new (...args: any[]) => T,
  ...args: any[]
): T {
  return new constructor(...args);
}

const myClassInstance: DOMChangeMonitor = createInstance(DOMChangeMonitor);

export type DOMChangeMonitorType = typeof myClassInstance;

export default DOMChangeMonitor;

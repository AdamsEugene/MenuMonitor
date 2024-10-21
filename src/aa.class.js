class HoverCapture {
  constructor() {
    this.hoverPath = [];
    this.hoverTimeout = null;
    this.navElement = null;
  }

  setupHoverCapture() {
    this.navElement =
      document.querySelector("nav") || document.querySelector("header");

    this.navElement.addEventListener("mouseover", (event) => {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.captureHoverState(event.target);
      }, 3000); // Reduced timeout for more responsive capturing
    });

    this.navElement.addEventListener("mouseout", (event) => {
      if (!this.navElement.contains(event.relatedTarget)) {
        clearTimeout(this.hoverTimeout);
      }
    });
  }

  captureHoverState(target) {
    let newPath = [];
    let element = target;

    while (element && element !== this.navElement) {
      newPath.unshift({
        element: element,
        rect: element.getBoundingClientRect(),
      });
      element = element.parentElement;
    }

    // Check if the new path is contained within or extends the existing path
    if (this.isPathContainedOrExtended(this.hoverPath, newPath)) {
      // If it is, just add any new elements to the existing path
      this.hoverPath = this.mergeHoverPaths(this.hoverPath, newPath);
    } else {
      // If it's not, replace the existing path
      this.hoverPath = newPath;
    }

    console.log("Hover state captured for:", this.hoverPath);
  }

  isPathContainedOrExtended(existingPath, newPath) {
    if (existingPath.length === 0) return false;

    let i = 0;
    while (i < existingPath.length && i < newPath.length) {
      if (existingPath[i].element !== newPath[i].element) {
        break;
      }
      i++;
    }

    return i > 0;
  }

  mergeHoverPaths(existingPath, newPath) {
    console.log({ existingPath, newPath });

    let commonLength = 0;
    while (
      commonLength < existingPath.length &&
      commonLength < newPath.length
    ) {
      if (
        existingPath[commonLength].element !== newPath[commonLength].element
      ) {
        break;
      }
      commonLength++;
    }

    return [
      ...existingPath.slice(0, commonLength),
      ...newPath.slice(commonLength),
    ];
  }

  replay() {
    if (this.hoverPath.length > 0) {
      this.hoverPath.forEach((item, index) => {
        setTimeout(() => {
          this.simulateHover(item.element, item.rect);
          console.log("Replaying hover state for:", item.element);
        }, index * 1);
      });
    } else {
      console.log("No hover state captured yet");
    }
  }

  simulateHover(element, rect) {
    const events = ["mouseenter", "mouseover", "focus"];
    events.forEach((eventType) => {
      const event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      });
      element.dispatchEvent(event);
    });
  }

  clear() {
    if (this.hoverPath.length > 0) {
      this.hoverPath
        .slice()
        .reverse()
        .forEach((item, index) => {
          setTimeout(() => {
            const events = ["mouseleave", "mouseout", "blur"];
            events.forEach((eventType) => {
              const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
              });
              item.element.dispatchEvent(event);
            });
            console.log("Cleared hover state for:", item.element);
          }, index * 100);
        });
      this.hoverPath = [];
    } else {
      console.log("No hover state to clear");
    }
  }
}

// Usage
const _hoverCapture = new HoverCapture();
_hoverCapture.setupHoverCapture();

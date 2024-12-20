let hoverPath = [];
let hoverTimeout;

function setupHoverCapture() {
  const navElement =
    document.querySelector("nav") || document.querySelector("header");

  navElement.addEventListener("mouseover", (event) => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      captureHoverState(event.target, navElement);
    }, 3000); // Reduced timeout for more responsive capturing
  });

  navElement.addEventListener("mouseout", (event) => {
    if (!navElement.contains(event.relatedTarget)) {
      clearTimeout(hoverTimeout);
    }
  });
}

function captureHoverState(target, navElement) {
  hoverPath = [];
  let element = target;
  while (element && element !== navElement) {
    hoverPath.unshift({
      element: element,
      rect: element.getBoundingClientRect(),
    });
    element = element.parentElement;
  }
  console.log("Hover state captured for:", hoverPath);
}

function replay() {
  if (hoverPath.length > 0) {
    hoverPath.forEach((item, index) => {
      setTimeout(() => {
        simulateHover(item.element, item.rect);
        console.log("Replaying hover state for:", item.element);
      }, index * 200);
    });
  } else {
    console.log("No hover state captured yet");
  }
}

function simulateHover(element, rect) {
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

function clear() {
  if (hoverPath.length > 0) {
    hoverPath
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
    hoverPath = [];
  } else {
    console.log("No hover state to clear");
  }
}

setupHoverCapture();

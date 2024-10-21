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
  let newPath = [];
  let element = target;

  while (element && element !== navElement) {
    newPath.unshift({
      element: element,
      rect: element.getBoundingClientRect(),
    });
    element = element.parentElement;
  }

  // Check if the new path is contained within or extends the existing path
  if (isPathContainedOrExtended(hoverPath, newPath)) {
    // If it is, just add any new elements to the existing path
    hoverPath = mergeHoverPaths(hoverPath, newPath);
  } else {
    // If it's not, replace the existing path
    hoverPath = newPath;
  }

  console.log("Hover state captured for:", hoverPath);
}

function isPathContainedOrExtended(existingPath, newPath) {
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

function mergeHoverPaths(existingPath, newPath) {
  console.log({ existingPath, newPath });

  let commonLength = 0;
  while (commonLength < existingPath.length && commonLength < newPath.length) {
    if (existingPath[commonLength].element !== newPath[commonLength].element) {
      break;
    }
    commonLength++;
  }

  return [
    ...existingPath.slice(0, commonLength),
    ...newPath.slice(commonLength),
  ];
}

function replay() {
  if (hoverPath.length > 0) {
    hoverPath.forEach((item, index) => {
      setTimeout(() => {
        simulateHover(item.element, item.rect);
        console.log("Replaying hover state for:", item.element);
      }, index * 1);
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

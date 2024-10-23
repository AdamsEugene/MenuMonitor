interface HoverPathItem {
  element: HTMLElement;
  rect: DOMRect;
}

class HoverCapture {
  private hoverPath: HoverPathItem[] = [];
  private hoverTimeout: number | null = null;
  private navElement: HTMLElement | null = null;
  private headerElement: HTMLElement | null = null;
  private dom: Document;
  private isRecording: boolean;

  constructor() {
    console.log("HoverCapture initialized");
  }

  private excludeElementsMap: Map<string, string> = new Map([
    ["a", "ui-hover"],
  ]);

  private classesToHide = [".overlay.is-visible"];

  init(containerId: string = "recordingPlayer1"): void {
    const document = window.document;
    const container = document.getElementById(containerId);
    this.dom =
      (container instanceof HTMLIFrameElement &&
        container.contentWindow?.document) ||
      document;

    const header = this.findVisibleHeader();
    if (!header) {
      console.error("Error: No visible header element found.");
      return;
    }

    const navById = this.dom.getElementById("main-nav");
    const navByClass = this.dom.querySelector(
      ".viair-header-main-links"
    ) as HTMLElement;

    this.headerElement =
      navById || navByClass || this.findLargestContainer(header);
    if (this.headerElement) {
      this.attachReopenMenuListener();
      this.navElement =
        navById ||
        navByClass ||
        this.getVisibleNavElements(this.headerElement)[0] ||
        this.headerElement;
      console.log("header: ", this.navElement);

      this.navElement.addEventListener(
        "mouseover",
        this.setupHoverCapture.bind(this)
      );
      this.navElement.addEventListener(
        "mouseout",
        this.stopHoverCapture.bind(this)
      );
    }
  }

  private findVisibleHeader(): HTMLElement | null {
    const headers = Array.from(this.dom.querySelectorAll("header"));
    return headers.find((header) => this.isElementVisible(header)) || null;
  }

  private findLargestContainer(element: HTMLElement): HTMLElement {
    let current = element;
    let parent = current.parentElement;

    while (parent && this.hasSamePositionSize(current, parent)) {
      current = parent;
      parent = current.parentElement;
    }

    return current;
  }

  private attachReopenMenuListener(): void {
    document.addEventListener("reopen-menu", this.handleReopenMenu.bind(this));
    document.addEventListener("close-menu", this.handleCloseMenu.bind(this));
  }

  private hasSamePositionSize(ele1: Element, ele2: Element): boolean {
    const rect1 = ele1.getBoundingClientRect();
    const rect2 = ele2.getBoundingClientRect();

    return (
      Math.abs(rect1.top - rect2.top) < 1 &&
      Math.abs(rect1.right - rect2.right) < 1 &&
      Math.abs(rect1.bottom - rect2.bottom) < 1 &&
      Math.abs(rect1.left - rect2.left) < 1
    );
  }

  private isElementVisible(element: Element): boolean {
    const computedStyles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return (
      computedStyles.display !== "none" &&
      computedStyles.visibility !== "hidden" &&
      rect.width > 10
    );
  }

  private getVisibleNavElements(container: HTMLElement): HTMLElement[] {
    const navElements = Array.from(container.querySelectorAll("nav"));
    const visibleNavs = navElements.filter((nav) => this.isElementVisible(nav));
    return visibleNavs.length > 0 ? visibleNavs : [container];
  }

  private setupHoverCapture(event: MouseEvent): void {
    if (this.hoverTimeout !== null) {
      clearTimeout(this.hoverTimeout);
    }

    this.hoverTimeout = window.setTimeout(() => {
      console.log("started...");
      this.captureHoverState(event.target as HTMLElement);
      if (event.target instanceof HTMLElement) {
      }
    }, 1000);
  }

  private stopHoverCapture(event: MouseEvent) {
    if (
      this.navElement &&
      !this.navElement.contains(event.relatedTarget as any)
    ) {
      if (this.hoverTimeout !== null) {
        console.log("stop capturing");
        clearTimeout(this.hoverTimeout);
      }
    }
  }

  private captureHoverState(target: HTMLElement): void {
    let newPath: HoverPathItem[] = [];
    let element: HTMLElement | null = target;

    while (
      element &&
      element !== this.navElement &&
      element !== this.headerElement
    ) {
      if (!this.shouldExcludeElement(element)) {
        newPath.unshift({
          element: element,
          rect: element.getBoundingClientRect(),
        });
      }
      element = element.parentElement;
    }

    if (this.isPathContainedOrExtended(this.hoverPath, newPath)) {
      this.hoverPath = this.mergeHoverPaths(this.hoverPath, newPath);
    } else {
      this.hoverPath = newPath;
    }

    console.log("Hover state captured for:", this.hoverPath);
  }

  private shouldExcludeElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    const className = this.excludeElementsMap.get(tagName);

    if (className && element.classList.contains(className)) {
      return true;
    }
    return false;
  }

  private isPathContainedOrExtended(
    existingPath: HoverPathItem[],
    newPath: HoverPathItem[]
  ): boolean {
    if (existingPath.length === 0) return false;
    const minLength = Math.min(existingPath.length, newPath.length);
    for (let i = 0; i < minLength; i++) {
      if (existingPath[i].element !== newPath[i].element) {
        return i > 0;
      }
    }
    return true;
  }

  private mergeHoverPaths(
    existingPath: HoverPathItem[],
    newPath: HoverPathItem[]
  ): HoverPathItem[] {
    const commonLength = existingPath.findIndex(
      (item, index) => item.element !== newPath[index]?.element
    );
    return commonLength === -1
      ? newPath
      : [
          ...existingPath.slice(0, commonLength),
          ...newPath.slice(commonLength),
        ];
  }

  replay(): void {
    if (this.hoverPath.length > 0) {
      this.hoverPath.forEach((item, index) => {
        setTimeout(() => {
          this.simulateHover(item.element, item.rect);
          console.log("Replaying hover state for:", item.element);
        }, index * 100);
      });
    } else {
      console.log("No hover state captured yet");
    }
  }

  private simulateHover(element: HTMLElement, rect: DOMRect): void {
    if (!element) {
      console.error("Element not found");
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const eventTypes = ["mouseenter", "mouseover", "mousemove", "focus"];

    eventTypes.forEach((eventType) => {
      const event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: centerX,
        clientY: centerY,
        screenX: centerX,
        screenY: centerY,
        which: 1,
        buttons: 1,
        relatedTarget: element.parentElement,
      });

      element.dispatchEvent(event);
    });

    // Simulate click for details elements
    if (
      element instanceof HTMLDetailsElement &&
      +this.getThis("idSite") === 1485
    ) {
      console.log("Simulating click on details element");
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: centerX,
        clientY: centerY,
        screenX: centerX,
        screenY: centerY,
        which: 1,
        buttons: 1,
        button: 0, // Left mouse button
      });
      element.dispatchEvent(clickEvent);
      element.open = !element.open;
    }

    if (element instanceof HTMLDetailsElement) {
      element.open = !element.open;
      element.classList.add("is-open");
    }

    this.handleMenuItemHover(element);
    this.handleMegaMenu(element);
    this.handleViairHeader(element);
    console.log("Simulated hover for:", element);
  }

  private clear(): void {
    if (this.hoverPath.length > 0) {
      this.hoverPath
        .slice()
        .reverse()
        .forEach((item, index) => {
          if (item.element instanceof HTMLDetailsElement) {
            item.element.removeAttribute("open");
            item.element.classList.remove("is-open");
          }
          setTimeout(() => {
            const events: string[] = ["mouseleave", "mouseout", "blur"];
            events.forEach((eventType) => {
              const event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
              });
              item.element.dispatchEvent(event);
            });
            console.log("Cleared hover state for:", item.element);
          }, index * 10);
          this.handleMenuItemClear(item.element);
          this.handleMegaMenuClear(item.element);
          this.handleViairHeaderClear(item.element);
        });
      this.hoverPath = [];
    } else {
      console.log("No hover state to clear");
    }

    this.classesToHide.forEach((cls) => {
      this.dom.querySelectorAll(cls).forEach((cl: HTMLElement) => {
        if (cl) {
          cl.style.opacity = "0";
          cl.style.visibility = "hidden";
        }
      });
    });
  }

  private handleViairHeader(element: HTMLElement) {
    if (element.classList.contains("viair-header-link-first-level")) {
      const ViairMegaMenuContent = element.querySelector(
        ".viair-header-mega-menu"
      ) as HTMLElement;

      if (ViairMegaMenuContent) {
        const newId = "the_id_you_added";
        ViairMegaMenuContent.id = newId;
        const style = this.dom.createElement("style");
        style.type = "text/css";
        style.innerHTML = `#${newId} { opacity: 1 !important; }`;
        this.dom.head.appendChild(style);
        ViairMegaMenuContent.style.setProperty("opacity", "1", "important");
      }
    }
  }
  private handleMegaMenu(element: HTMLElement): void {
    if (element.classList.contains("header__menu-li-js")) {
      const megaMenuContent = element.querySelector(
        ".mega-menu__content"
      ) as HTMLElement;
      if (megaMenuContent) {
        megaMenuContent.style.setProperty("opacity", "1", "important");
      }
    }
  }

  private handleMenuItemHover(element: HTMLElement): void {
    if (element.id.startsWith("menu-item-")) {
      const subMenu = element.querySelector(".sub-menu") as HTMLElement;
      if (subMenu) {
        subMenu.style.opacity = "1";
        subMenu.style.visibility = "visible";
        subMenu.style.top = "100%";
      }
    }
  }

  private handleMenuItemClear(element: HTMLElement): void {
    if (element.id.startsWith("menu-item-")) {
      const subMenu = element.querySelector(".sub-menu") as HTMLElement;
      if (subMenu) {
        subMenu.style.opacity = "0";
        subMenu.style.visibility = "hidden";
        subMenu.style.top = "120%";
      }
    }

    (
      this.dom.querySelector(
        ".header-skrim.opacity-0.d-empty-block"
      ) as HTMLElement
    )?.style.setProperty("opacity", "0", "important");
  }

  private handleMegaMenuClear(element: HTMLElement): void {
    if (element.classList.contains("header__menu-li-js")) {
      const megaMenuContent = element.querySelector(
        ".mega-menu__content"
      ) as HTMLElement;
      if (megaMenuContent) {
        megaMenuContent.style.setProperty("opacity", "0");
      }
    }
  }

  private handleViairHeaderClear(element: HTMLElement) {
    if (element.classList.contains("viair-header-link-first-level")) {
      const ViairMegaMenuContent = element.querySelector(
        ".viair-header-mega-menu"
      ) as HTMLElement;
      if (ViairMegaMenuContent) {
        ViairMegaMenuContent.style.setProperty("opacity", "0");
        ViairMegaMenuContent.removeAttribute("id");
      }
    }
  }

  public replayChanges() {
    this.replay();
  }

  public clearChanges() {
    this.clear();
  }

  private handleReopenMenu(event: Event): void {
    console.log("Reopening menu");
    this.replayChanges();
  }

  private handleCloseMenu(event: Event): void {
    console.log("Closing menu");
    this.clearChanges();
  }

  public reopenMenu(): void {
    document.dispatchEvent(new CustomEvent("reopen-menu"));
  }

  public closeActiveMenu(): void {
    document.dispatchEvent(new CustomEvent("close-menu"));
  }

  private getThis(item: string) {
    const parsedUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(parsedUrl.search);
    const hashParams = new URLSearchParams(parsedUrl.hash.slice(1));

    return searchParams.get(item) || hashParams.get(item) || 0;
  }
}

function createInstance<T>(
  constructor: new (...args: any[]) => T,
  ...args: any[]
): T {
  return new constructor(...args);
}

const myClassInstance: HoverCapture = createInstance(HoverCapture);

export type HoverCaptureType = typeof myClassInstance;

export default HoverCapture;

import { getRedirectType, getThis } from "./shared/functions";
import Specifics from "./shared/Specifics";

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
  private isReplaying: boolean = false;
  private siteSpecifics: Specifics;
  private isDevMode = false;

  constructor() {
    this.isDevMode = getRedirectType() !== "dashboard";

    if (this.isDevMode) console.log("HoverCapture initialized");
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

    this.siteSpecifics = new Specifics(this.dom);
    this.siteSpecifics.hideAliaPopups(this.dom);

    const navById = this.dom.querySelector(
      "#main-nav, #main-menu, #header-main"
    ) as HTMLElement;
    const navByClass = this.dom.querySelector(
      ".viair-header-main-links, .site-control__inline-links, .site-header__element.site-header__element--sub, .elementor-widget-nav-menu, .element.element-menu, .header.header-fixed--true.is-absolute"
    ) as HTMLElement;

    const header =
      this.findVisibleHeader() ||
      navById ||
      navByClass ||
      this.getFirstVisibleNav();
    if (!header) {
      if (this.isDevMode)
        console.error("Error: No visible header element found.");
      return;
    }

    this.headerElement =
      navById ||
      navByClass ||
      this.findLargestContainer(header) ||
      this.getFirstVisibleNav();
    if (this.headerElement) {
      this.attachReopenMenuListener();
      this.navElement =
        navById ||
        navByClass ||
        this.getVisibleNavElements(this.headerElement)[0] ||
        this.headerElement;
      if (this.isDevMode) console.log("header: ", this.navElement);

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

  private getFirstVisibleNav(): HTMLElement | null {
    const navs = document.querySelectorAll("nav") as NodeListOf<HTMLElement>;

    const navArray = Array.from(navs) as HTMLElement[];

    for (const nav of navArray) {
      const rect = nav.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(nav);

      const isVisible =
        computedStyle.display !== "none" &&
        computedStyle.visibility === "visible";
      const hasChildren = nav.children.length > 0;
      const hasReasonableDimensions = rect.width > 100 && rect.height > 50;

      const hasNavWrapper = nav.querySelector(".nav-wrapper") !== null;
      const hasSkipToContent =
        hasNavWrapper &&
        this.containsTextContent(
          nav.querySelector(".nav-wrapper"),
          "Skip to content"
        );

      if (
        isVisible &&
        hasChildren &&
        hasReasonableDimensions &&
        (!hasNavWrapper || !hasSkipToContent)
      ) {
        return nav as HTMLElement;
      }
    }

    return null;
  }

  private containsTextContent(element: Element | null, text: string): boolean {
    if (!element) return false;

    return Array.from(element.childNodes).some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.includes(text) ?? false;
      }
      return this.containsTextContent(node as Element, text);
    });
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
      rect.width > 10 &&
      rect.height > 30
    );
  }

  private getVisibleNavElements(container: HTMLElement): HTMLElement[] {
    const navElements = Array.from(container.querySelectorAll("nav"));
    const visibleNavs = navElements.filter((nav) => this.isElementVisible(nav));
    return visibleNavs.length > 0 ? visibleNavs : [container];
  }

  private setupHoverCapture(event: MouseEvent): void {
    // Don't capture new hover states during replay
    if (this.isReplaying) {
      return;
    }

    if (this.hoverTimeout !== null) {
      clearTimeout(this.hoverTimeout);
    }

    this.hoverTimeout = window.setTimeout(() => {
      console.log("started...");
      this.captureHoverState(event.target as HTMLElement);
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

    if (this.isDevMode)
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
      this.isReplaying = true; // Set flag before replay

      const replayPromise = new Promise<void>((resolve) => {
        let completed = 0;
        this.hoverPath.forEach((item, index) => {
          setTimeout(() => {
            this.simulateHover(item.element, item.rect);
            if (this.isDevMode)
              console.log("Replaying hover state for:", item.element);
            completed++;
            if (completed === this.hoverPath.length) {
              resolve();
            }
          }, index * 100);
        });
      });

      // Reset the flag after replay completes
      replayPromise.then(() => {
        setTimeout(() => {
          this.isReplaying = false;
        }, 100); // Small buffer after last replay action
      });
    } else {
      if (this.isDevMode) console.log("No hover state captured yet");
    }
  }

  private simulateHover(element: HTMLElement, rect: DOMRect): void {
    if (!element) {
      if (this.isDevMode) console.error("Element not found");
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
      getThis("idSite") === "2761" ||
      (element.tagName.toLowerCase() === "details" &&
        +getThis("idSite") === 1485)
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
      (element as HTMLDetailsElement).open = !(element as HTMLDetailsElement)
        .open;
    }

    let count = 0;
    function handleToggle() {
      count += 1;
      if (!(element as HTMLDetailsElement).open) {
        element.setAttribute("open", ""); // Prevent closing
        element.classList.add("is-open");
        count > 5 && element.removeEventListener("toggle", handleToggle);
      }
    }
    if (element.tagName.toLowerCase() === "details") {
      (element as HTMLDetailsElement).open = true;
      element.setAttribute("open", "true");
      element.classList.add("is-open");
      element.addEventListener("toggle", handleToggle);
    }

    this.siteSpecifics.handleMenuItemHover(element);
    this.siteSpecifics.handleMegaMenu(element);
    this.siteSpecifics.handleViairHeader(element);
    this.siteSpecifics.handleFollowMenu(element);
    this.siteSpecifics.handleFlowerMenu(element);
    this.siteSpecifics.handlePureSportMenu(element);
    this.siteSpecifics.handleAKTMenu(element);
    this.siteSpecifics.handleNubianceHoverClear(element);
    this.siteSpecifics.handleDeuxMenuItemHover(element);
    this.siteSpecifics.handleFourthMenuItemHover(element);
    this.siteSpecifics.handlePlusbogMenuHover(element);
    this.siteSpecifics.handleSaltMenuItemHover(element);
    this.siteSpecifics.handleCanvasMenuItemHover(element);
    this.siteSpecifics.handleEssenceMenuItemHover(element);
    this.siteSpecifics.handleTargetMenuItemHover(element);

    if (this.isDevMode) console.log("Simulated hover for:", element);
  }

  private clear(): void {
    if (this.hoverPath.length > 0) {
      this.hoverPath
        .slice()
        .reverse()
        .forEach((item, index) => {
          if (item.element.tagName.toLowerCase() === "details") {
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
            if (this.isDevMode)
              console.log("Cleared hover state for:", item.element);
          }, index * 10);
          this.siteSpecifics.handleMenuItemClear(item.element);
          this.siteSpecifics.handleMegaMenuClear(item.element);
          this.siteSpecifics.handleViairHeaderClear(item.element);
          this.siteSpecifics.handleFollowMenuClear(item.element);
          this.siteSpecifics.handleFlowerMenuClear(item.element);
          this.siteSpecifics.handlePureSportMenuClear(item.element);
          this.siteSpecifics.handleAKTMenuClear(item.element);
          this.siteSpecifics.handleNubianceHoverClear(item.element);
          this.siteSpecifics.handleDeuxMenuItemHoverClear(item.element);
          this.siteSpecifics.handleFourthMenuItemClear(item.element);
          this.siteSpecifics.handlePlusbogMenuClear(item.element);
          this.siteSpecifics.handleSaltMenuItemClear(item.element);
          this.siteSpecifics.handleCanvasMenuItemClear(item.element);
          this.siteSpecifics.handleEssenceMenuItemClear(item.element);
          this.siteSpecifics.handleTargetMenuItemClear(item.element);
        });
      this.hoverPath = [];
    } else {
      if (this.isDevMode) console.log("No hover state to clear");
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

  public replayChanges() {
    this.replay();
  }

  public clearChanges() {
    this.clear();
  }

  private handleReopenMenu(event: Event): void {
    if (this.isDevMode) console.log("Reopening menu");
    this.replayChanges();
  }

  private handleCloseMenu(event: Event): void {
    if (this.isDevMode) console.log("Closing menu");
    this.clearChanges();
  }

  public reopenMenu(): void {
    document.dispatchEvent(new CustomEvent("reopen-menu"));
  }

  public closeActiveMenu(): void {
    document.dispatchEvent(new CustomEvent("close-menu"));
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

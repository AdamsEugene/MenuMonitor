import DOMChangeMonitor from "./DOMChangeMonitor.new";

class MenuMonitor {
  private navElement: HTMLElement | null = null;
  private headerElement: HTMLElement | null = null;
  private debugMode: boolean;

  private dOMChangeMonitor: DOMChangeMonitor;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  private hasSamePositionSize(ele1: HTMLElement, ele2: HTMLElement): boolean {
    const rect1 = ele1.getBoundingClientRect();
    const rect2 = ele2.getBoundingClientRect();

    return (
      rect1.top === rect2.top &&
      rect1.right === rect2.right &&
      rect1.bottom === rect2.bottom &&
      rect1.left === rect2.left
    );
  }

  private isElementVisible(element: HTMLElement) {
    const computedStyles = window.getComputedStyle(element);
    return (
      computedStyles.display !== "none" &&
      computedStyles.visibility !== "hidden"
    );
  }

  private getVisibleNavElements(container: HTMLElement | null): HTMLElement[] {
    if (!container) return [];
    const navElements = container.querySelectorAll("nav");
    if (!navElements) return [container];
    const visibleNavElements = Array.from(navElements).filter((element) => {
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    });
    return visibleNavElements.length > 0 ? visibleNavElements : [container];
  }

  public init(containerId = "recordingPlayer", debugMode = false) {
    this.debugMode = debugMode;

    const document = window.document;
    const iframe = document.getElementById(containerId) as HTMLIFrameElement;
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

    let currentElement = header as HTMLElement;
    let parentElement = currentElement.parentElement as HTMLElement;

    while (
      parentElement &&
      this.hasSamePositionSize(currentElement, parentElement)
    ) {
      currentElement = parentElement;
      parentElement = currentElement.parentElement as HTMLElement;
    }

    this.headerElement = currentElement;

    if (this.headerElement) {
      this.attachReopenMenuListener();
      this.navElement = this.getVisibleNavElements(this.headerElement)[0];
      console.log("nav: ", this.navElement);

      this.dOMChangeMonitor = new DOMChangeMonitor();
      this.dOMChangeMonitor.init();

      if (this.navElement) {
      }
    }
  }

  private attachReopenMenuListener() {
    document.addEventListener("reopen-menu", this.handleReopenMenu.bind(this));
    document.addEventListener("close-menu", this.handleCloseMenu.bind(this));
  }

  private handleReopenMenu() {
    console.log("called");
    this.dOMChangeMonitor.replayChanges();
  }

  private handleCloseMenu() {
    this.dOMChangeMonitor.clearChanges();
  }

  public reopenMenu() {
    document.dispatchEvent(new CustomEvent("reopen-menu", { detail: true }));
  }

  public closeMenu() {
    document.dispatchEvent(new CustomEvent("close-menu", { detail: true }));
  }

  public closeActiveMenu() {
    this.handleCloseMenu();
  }
}

function createInstance<T>(
  constructor: new (...args: any[]) => T,
  ...args: any[]
): T {
  return new constructor(...args);
}

const myClassInstance: MenuMonitor = createInstance(MenuMonitor);

export type MenuMonitorType = typeof myClassInstance;

export default MenuMonitor;

// class MenuMonitor {
//   private hoverTimer: ReturnType<typeof setTimeout> | null = null;
//   private hoverElement: HTMLElement | null = null;
//   private hoverDuration: number = 500;
//   private mutations: MutationRecord[] = [];
//   private previousMutations: MutationRecord[] = [];
//   private isRecording: boolean = false;
//   private clonedElements: Map<Node, Node> = new Map();
//   private previousClonedElements: Map<Node, Node> = new Map();
//   private menuName: string = "unknown";
//   private hiddenElements: Map<Element, boolean> = new Map();
//   private detailsElements: Map<HTMLDetailsElement, boolean> = new Map();
//   private invisibleElements: Map<Element, boolean> = new Map();
//   private blurElements: Map<Element, boolean> = new Map();
//   private displayChangedElements: Map<Element, string> = new Map();
//   private detailChangedElements: Map<HTMLDetailsElement, boolean> = new Map();
//   private visibilityChangedElements: Map<Element, string> = new Map();
//   private opacityChangedElements: Map<Element, number> = new Map();
//   private navElement: HTMLElement | null = null;
//   private headerElement: HTMLElement | null = null;
//   private debugMode: boolean;

//   constructor(debugMode = false) {
//     this.debugMode = debugMode;
//   }

//   hasSamePositionAndSize(elem1: HTMLElement, elem2: HTMLElement): boolean {
//     const rect1 = elem1.getBoundingClientRect();
//     const rect2 = elem2.getBoundingClientRect();
//     return (
//       rect1.top === rect2.top &&
//       rect1.right === rect2.right &&
//       rect1.bottom === rect2.bottom &&
//       rect1.left === rect2.left
//     );
//   }

//   visibleNav(e: any, t: any, n: any) {}

//   getVisibleNavElements(container: HTMLElement | null): HTMLElement[] {
//     const navElements = container?.querySelectorAll("nav");
//     if (!navElements) return [];
//     return Array.from(navElements).filter((element) => {
//       const style = getComputedStyle(element);
//       return style.display !== "none" && style.visibility !== "hidden";
//     });
//   }

//   init(containerId = "recordingPlayer", debugMode = false) {
//     this.debugMode = debugMode;
//     const document = window.document;
//     const container = document.getElementById(containerId) as HTMLIFrameElement;
//     const doc = container?.contentWindow?.document || document;

//     applyStyles(doc);
//     hidePopup(doc);

//     const header = doc.querySelector("header");

//     if (header) {
//       console.log("header: ", header);
//       this.headerElement = this.getClosestParentWithDifferentDimensions(header);
//       this.attachMutationObserver();
//       this.attachHoverListener();
//       this.attachReopenMenuListener();
//       this.navElement =
//         this.getVisibleNavElements(this.headerElement)[0] ||
//         header.querySelector("header");
//       const detailsElements = this.headerElement?.querySelectorAll("details");
//       if (this.navElement) {
//         this.createHiddenElementsMap(this.navElement);
//         this.createInvisibleElementsMap(this.navElement);
//         this.createBlurElementsMap(this.navElement);
//       }
//       if (detailsElements && detailsElements.length > 0) {
//         this.createDetailsElementMap(detailsElements);
//       }
//     } else {
//       console.error("Error: No header element found.");
//     }
//   }

//   getClosestParentWithDifferentDimensions(element: HTMLElement): HTMLElement {
//     let currentElement = element;
//     let parentElement = currentElement.parentElement;
//     while (
//       parentElement &&
//       this.hasSamePositionAndSize(currentElement, parentElement)
//     ) {
//       currentElement = parentElement;
//       parentElement = currentElement.parentElement;
//     }
//     return currentElement;
//   }

//   createDetailsElementMap(detailsElements: NodeListOf<HTMLDetailsElement>) {
//     detailsElements.forEach((element) => {
//       if (!element.open) this.detailsElements.set(element, element.open);
//     });
//     console.log("detailsElements: ", this.detailsElements);
//   }

//   createHiddenElementsMap(container: HTMLElement) {
//     container.querySelectorAll("*").forEach((element) => {
//       if (window.getComputedStyle(element).display === "none") {
//         this.hiddenElements.set(element, true);
//       }
//     });
//   }

//   createInvisibleElementsMap(container: HTMLElement) {
//     container.querySelectorAll("*").forEach((element) => {
//       if (window.getComputedStyle(element).visibility === "hidden") {
//         this.invisibleElements.set(element, true);
//       }
//     });
//   }

//   createBlurElementsMap(container: HTMLElement) {
//     container.querySelectorAll("*").forEach((element) => {
//       if (parseFloat(window.getComputedStyle(element).opacity) < 1) {
//         this.blurElements.set(element, true);
//       }
//     });
//   }

//   attachMutationObserver() {
//     const observer = new MutationObserver(this.handleMutations.bind(this));
//     if (this.headerElement) {
//       observer.observe(this.headerElement, {
//         attributes: true,
//         childList: true,
//         subtree: true,
//         characterData: true,
//       });
//     }
//   }

//   attachHoverListener() {
//     this.headerElement?.addEventListener(
//       "mouseover",
//       this.handleMouseOver.bind(this)
//     );
//     this.headerElement?.addEventListener(
//       "mouseout",
//       this.handleMouseOut.bind(this)
//     );
//   }

//   attachReopenMenuListener() {
//     document.addEventListener("reopen-menu", this.handleReopenMenu.bind(this));
//     document.addEventListener("close-menu", this.handleCloseMenu.bind(this));
//   }

//   isMenuOpen(classList: DOMTokenList): boolean {
//     return classList.contains("is-active") || classList.contains("is-expanded");
//   }

//   handleMutations(mutations: MutationRecord[]) {
//     for (const mutation of mutations) {
//       const target = mutation.target as HTMLElement;
//       if (
//         !this.isRecording &&
//         mutation.type === "attributes" &&
//         mutation.attributeName === "class" &&
//         this.isMenuOpen((mutation.target as HTMLElement).classList) &&
//         this.headerElement?.contains(target)
//       ) {
//         this.startRecording(mutation, target);
//       } else if (this.isRecording && this.headerElement?.contains(target)) {
//         this.processMutation(mutation, target);
//       }
//     }
//   }

//   startRecording(mutation: MutationRecord, target: HTMLElement) {
//     this.isRecording = true;
//     this.mutations = [];
//     this.clonedElements.clear();
//     this.clonedElements.set(target, target.cloneNode(true) as Node);
//     this.mutations.push(mutation);
//     if (this.debugMode) {
//       this.debugLogMutation("set className - start recording", mutation);
//     }
//   }

//   processMutation(mutation: MutationRecord, target: HTMLElement) {
//     const isClassMutation =
//       mutation.type === "attributes" && mutation.attributeName === "class";
//     if (
//       isClassMutation &&
//       this.isMenuOpen(target.classList) &&
//       !this.isMenuOpen((mutation.target as HTMLElement).classList)
//     ) {
//       this.stopRecording(mutation);
//       return;
//     }
//     this.debugLogMutation(
//       isClassMutation
//         ? "set className"
//         : `other mutation ${mutation.attributeName}`,
//       mutation
//     );
//     this.clonedElements.set(target, target.cloneNode(true) as Node);
//     this.mutations.push(mutation);
//   }

//   stopRecording(mutation: MutationRecord) {
//     if (this.debugMode) {
//       this.debugLogMutation("set className - stop recording", mutation);
//     }
//     this.isRecording = false;
//   }

//   debugLogMutation(message: string, mutation: MutationRecord) {
//     console.log(
//       "-------------------------------------------------------------------------------------------------------------------------------"
//     );
//     console.log(message);
//     console.log(
//       "-------------------------------------------------------------------------------------------------------------------------------"
//     );
//     console.log(mutation.target);
//     console.log((mutation.target as HTMLElement).classList);
//     console.log(
//       "-------------------------------------------------------------------------------------------------------------------------------"
//     );
//   }

//   handleMouseOver(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     if (this.headerElement?.contains(target)) {
//       this.hoverElement = target;
//       this.startHoverTimer();
//     }
//   }

//   recordDisplayChanges() {
//     this.hiddenElements.forEach((_, element) => {
//       const display = window.getComputedStyle(element).display;
//       if (display !== "none") {
//         this.displayChangedElements.clear();
//         this.displayChangedElements.set(element, display);
//       }
//     });
//   }

//   recordDetailsChanges() {
//     this.detailsElements.forEach((_, element) => {
//       if (element.open) {
//         this.detailChangedElements.clear();
//         this.detailChangedElements.set(element, element.open);
//       }
//     });
//   }

//   recordVisibilityChanges() {
//     this.invisibleElements.forEach((_, element) => {
//       const visibility = window.getComputedStyle(element).visibility;
//       if (visibility !== "hidden") {
//         this.visibilityChangedElements.set(element, visibility);
//       }
//     });
//   }

//   recordBlurredChanges() {
//     this.invisibleElements.forEach((_, element) => {
//       const opacity = parseFloat(window.getComputedStyle(element).opacity);
//       if (opacity > 0) {
//         this.opacityChangedElements.set(element, opacity);
//       }
//     });
//   }

//   handleMouseOut() {
//     this.stopHoverTimer();
//     this.hoverElement = null;
//   }

//   startHoverTimer() {
//     this.stopHoverTimer();
//     this.hoverTimer = setTimeout(() => {
//       if (this.hoverElement) {
//         this.recordDisplayChanges();
//         this.recordDetailsChanges();
//         this.recordVisibilityChanges();
//         this.recordBlurredChanges();
//         this.menuName = this.hoverElement.innerText || "selected";
//         console.log(`Capturing mutations now for ${this.menuName} menu`);
//         this.dispatchMenuOpenEvent();
//         this.previousMutations = [...this.mutations];
//         this.previousClonedElements = new Map(this.clonedElements);
//         this.hoverTimer = null;
//         this.isRecording = false;
//       }
//     }, this.hoverDuration);
//   }

//   stopHoverTimer() {
//     if (this.hoverTimer) {
//       clearTimeout(this.hoverTimer);
//       this.hoverTimer = null;
//     }
//   }

//   dispatchMenuOpenEvent() {
//     const event = new CustomEvent("menu-open", {
//       detail: { mutations: this.mutations },
//     });
//     document.dispatchEvent(event);
//     this.isRecording = false;
//     console.log('listen to this event "menu-open"');
//   }

//   dispatchMenuCloseRequiredEvent() {
//     const event = new CustomEvent("menu-close-required", {
//       detail: { mutations: this.mutations },
//     });
//     console.log("dispatchMenuCloseRequiredEvent");
//     document.dispatchEvent(event);
//     this.isRecording = false;
//     console.log('listen to this event "menu-close-required"');
//   }

//   dispatchHideCloseEvent() {
//     const event = new CustomEvent("hide-close-menu", {
//       detail: { mutations: this.mutations },
//     });
//     console.log("dispatchMenuCloseRequiredEvent");
//     document.dispatchEvent(event);
//     this.isRecording = false;
//     console.log('listen to this event "hide-close-menu"');
//   }

//   handleReopenMenu() {
//     if (!this.hoverElement) {
//       this.reapplyMutations();
//     }
//   }

//   handleCloseMenu() {
//     this.hiddenElements.forEach((_, element: HTMLElement) => {
//       element.style.removeProperty("display");
//     });
//     this.headerElement?.querySelectorAll("details")?.forEach((element) => {
//       element.removeAttribute("open");
//     });
//     this.visibilityChangedElements.forEach((_, element: HTMLElement) => {
//       element.style.removeProperty("visibility");
//     });
//     this.opacityChangedElements.forEach((_, element: HTMLElement) => {
//       element.style.removeProperty("opacity");
//     });
//     this.displayChangedElements.clear();
//     this.detailChangedElements.clear();
//     this.visibilityChangedElements.clear();
//     this.opacityChangedElements.clear();
//     this.dispatchHideCloseEvent();
//   }

//   reapplyMutations() {
//     for (const mutation of this.previousMutations) {
//       const target = mutation.target as HTMLElement;
//       const clonedElement = this.previousClonedElements.get(
//         target
//       ) as HTMLElement;
//       if (clonedElement) {
//         switch (mutation.type) {
//           case "attributes":
//             const attributeValue = (clonedElement as HTMLElement).getAttribute(
//               mutation.attributeName!
//             );
//             target.setAttribute(mutation.attributeName!, attributeValue!);
//             break;
//           case "childList":
//             mutation.addedNodes.forEach((node) => {
//               const clonedNode = clonedElement.querySelector(
//                 `[data-node-id="${(node as HTMLElement).getAttribute(
//                   "data-node-id"
//                 )}"]`
//               );
//               if (clonedNode) {
//                 target.appendChild(clonedNode.cloneNode(true));
//               }
//             });
//             mutation.removedNodes.forEach((node) => {
//               const targetNode = target.querySelector(
//                 `[data-node-id="${(node as HTMLElement).getAttribute(
//                   "data-node-id"
//                 )}"]`
//               );
//               if (targetNode) {
//                 target.removeChild(targetNode);
//               }
//             });
//             break;
//           case "characterData":
//             target.textContent = clonedElement.textContent;
//             break;
//         }
//       }
//     }
//     this.reapplyDisplayChanges();
//     this.reapplyDetailsChanges();
//     this.reapplyVisibilityChanges();
//     this.reapplyBlurredChanges();
//   }

//   reapplyDisplayChanges() {
//     let hasChanges = false;
//     this.displayChangedElements.forEach((display, element: HTMLElement) => {
//       element.style.display = display;
//       hasChanges = true;
//     });
//     if (hasChanges) {
//       this.dispatchMenuCloseRequiredEvent();
//     }
//   }

//   reapplyDetailsChanges() {
//     let hasChanges = false;
//     this.detailChangedElements.forEach((open, element) => {
//       console.log(open, element);

//       element.setAttribute("open", `${open}`);
//       element.setAttribute("aria-expanded", `${open}`);
//       hasChanges = true;
//     });
//     if (hasChanges) {
//       this.dispatchMenuCloseRequiredEvent();
//     }
//   }

//   reapplyVisibilityChanges() {
//     let hasChanges = false;
//     this.visibilityChangedElements.forEach(
//       (visibility, element: HTMLElement) => {
//         element.style.visibility = visibility;
//         hasChanges = true;
//       }
//     );
//     if (hasChanges) {
//       this.dispatchMenuCloseRequiredEvent();
//     }
//   }

//   reapplyBlurredChanges() {
//     let hasChanges = false;
//     this.opacityChangedElements.forEach((opacity, element: HTMLElement) => {
//       element.style.opacity = `${opacity}`;
//       hasChanges = true;
//     });
//     this.adjustMenuMaxHeight();
//     if (hasChanges) {
//       this.dispatchMenuCloseRequiredEvent();
//     }
//   }

//   adjustMenuMaxHeight() {
//     const dropdowns = this.navElement?.querySelectorAll(".rtnu-nav__dropdown");
//     dropdowns?.forEach((dropdown: HTMLElement) => {
//       dropdown.style.maxHeight = "500px";
//     });
//     const mainContainers = this.navElement?.querySelectorAll(
//       ".mega-menu__main-container"
//     );
//     mainContainers?.forEach((container: HTMLElement) => {
//       container.style.maxHeight = "800px";
//       container.style.paddingTop = "48px";
//       container.style.paddingBottom = "48px";
//       container.style.cursor = "auto";
//       container.style.height = "100%";
//     });
//   }

//   removeIsActiveClass() {
//     const activeElements = this.headerElement?.querySelectorAll(
//       ".is-active, .is-expanded"
//     );
//     activeElements?.forEach((element) => {
//       element.classList.remove("is-active", "is-expanded");
//     });
//   }

//   reopenMenu() {
//     document.dispatchEvent(new CustomEvent("reopen-menu", { detail: true }));
//   }

//   closeMenu() {
//     document.dispatchEvent(new CustomEvent("close-menu", { detail: true }));
//   }

//   closeActiveMenu() {
//     this.removeIsActiveClass();
//     this.handleCloseMenu();
//   }
// }

// function applyStyles(doc: Document | undefined) {
//   doc
//     ?.querySelectorAll(".lai-star-rating-none svg, .lai-star-rating svg")
//     .forEach((element) => {
//       (element as HTMLElement).style.maxWidth = "20px";
//       (element as HTMLElement).style.float = "left";
//     });
// }

// function hidePopup(doc: Document | undefined) {
//   const popup = doc?.querySelector(".canadian-first-popup");
//   if (popup) {
//     const sibling = popup.previousElementSibling as HTMLElement;
//     if (sibling && sibling.children.length === 0 && sibling.className === "") {
//       sibling.style.setProperty("display", "none", "important");
//     }
//   }
// }

// function createInstance<T>(
//   constructor: new (...args: any[]) => T,
//   ...args: any[]
// ): T {
//   return new constructor(...args);
// }

// const myClassInstance: MenuMonitor = createInstance(MenuMonitor);

// export type MenuMonitorType = typeof myClassInstance;

// export default MenuMonitor;

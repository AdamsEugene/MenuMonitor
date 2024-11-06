export default class Specifics {
  private dom: Document;

  constructor(dom: Document) {
    this.dom = dom;
  }

  private setStyle(
    element: HTMLElement,
    styles: { [key: string]: string },
    notImportant?: boolean
  ) {
    for (const [property, value] of Object.entries(styles)) {
      if (notImportant) element.style.setProperty(property, value);
      else element.style.setProperty(property, value, "important");
    }
  }

  private removeStyle(element: HTMLElement, styles: string[]) {
    styles.forEach((property) => {
      element.style.removeProperty(property);
    });
  }

  private getMenuContent(
    element: HTMLElement,
    selector: string
  ): HTMLElement | null {
    return element.querySelector(selector) as HTMLElement;
  }

  public handleFollowMenu(element: HTMLElement): void {
    if (element.classList.contains("contains-children")) {
      const followMenuContent = this.getMenuContent(element, ".nav-rows");
      if (followMenuContent) {
        this.setStyle(followMenuContent, {
          opacity: "1",
          visibility: "visible",
          "max-height": "max-content",
        });
      }
    }
  }

  public handleFlowerMenu(element: HTMLElement): void {
    if (
      element.classList.contains("site-nav--is-megamenu") ||
      element.classList.contains("site-nav__item") ||
      element.classList.contains("header__link-nav") ||
      element.classList.contains("menu-item") ||
      element.classList.contains("list-menu-has-child")
    ) {
      const flowerMenuContent = this.getMenuContent(
        element,
        ".site-nav__dropdown, .header__meganav, .dropdown-menu, .header-mega-menu"
      );
      if (flowerMenuContent) {
        this.setStyle(flowerMenuContent, {
          opacity: "1",
          visibility: "visible",
        });
      }
    }
  }

  public handleViairHeader(element: HTMLElement): void {
    if (element.classList.contains("viair-header-link-first-level")) {
      const ViairMegaMenuContent = this.getMenuContent(
        element,
        ".viair-header-mega-menu"
      );

      if (ViairMegaMenuContent) {
        const newId = "the_id_you_added";
        ViairMegaMenuContent.id = newId;

        const style = this.dom.createElement("style");
        style.type = "text/css";
        style.innerHTML = `#${newId} { opacity: 1 !important; }`;
        this.dom.head.appendChild(style);

        this.setStyle(ViairMegaMenuContent, { opacity: "1" });
      }
    }
  }

  public handleMegaMenu(element: HTMLElement): void {
    if (element.classList.contains("header__menu-li-js")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".mega-menu__content"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, { opacity: "1" });
      }
    }
  }

  public handlePureSportMenu(element: HTMLElement): void {
    if (element.classList.contains("ps-relative")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".js-mega-menu_inner"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, { display: "flex" });
      }
    }
  }

  public handleMenuItemHover(element: HTMLElement): void {
    if (element.id.startsWith("menu-item-")) {
      const subMenu = this.getMenuContent(element, ".sub-menu");
      if (subMenu) {
        this.setStyle(subMenu, {
          opacity: "1",
          visibility: "visible",
          top: "100%",
        });
      }
    }
  }

  public handleDeuxMenuItemHover(element: HTMLElement): void {
    if (element.id.startsWith("Details-HeaderMenu-")) {
      const subMenu = this.getMenuContent(element, ".MainOuterCombineBgNav");
      if (subMenu) {
        this.setStyle(subMenu, { display: "block" });
      }
    }
  }

  public handleAKTMenu(element: HTMLElement): void {
    if (element.classList.contains("big:relative")) {
      const megaMenuContent = this.getMenuContent(element, "div");
      if (megaMenuContent) {
        const newId = "the_id_for_akt";
        megaMenuContent.id = newId;

        const style = this.dom.createElement("style");
        style.type = "text/css";
        style.innerHTML = `#${newId} { display: block !important; }`;
        this.dom.head.appendChild(style);

        this.setStyle(megaMenuContent, { display: "block" });
      }
    }
  }

  public handleNubianceHover(element: HTMLElement): void {
    if (element.classList.contains("menu__item")) {
      const subMenu = this.getMenuContent(element, ".header__dropdown");
      if (subMenu) {
        this.setStyle(subMenu, {
          opacity: "1",
          visibility: "visible",
          background: "rgb(255, 255, 255)",
          transform: "scale(1)",
        });
      }
    }
  }

  public handleFollowMenuClear(element: HTMLElement): void {
    if (element.classList.contains("contains-children")) {
      const followMenuContent = this.getMenuContent(element, ".nav-rows");
      if (followMenuContent) {
        this.removeStyle(followMenuContent, [
          "opacity",
          "visibility",
          "max-height",
        ]);
      }
    }
  }

  public handleFlowerMenuClear(element: HTMLElement): void {
    if (
      element.classList.contains("site-nav--is-megamenu") ||
      element.classList.contains("site-nav__item") ||
      element.classList.contains("header__link-nav") ||
      element.classList.contains("menu-item") ||
      element.classList.contains("list-menu-has-child")
    ) {
      const flowerMenuContent = this.getMenuContent(
        element,
        ".site-nav__dropdown, .header__meganav, .dropdown-menu, .header-mega-menu"
      );
      if (flowerMenuContent) {
        this.removeStyle(flowerMenuContent, ["opacity", "visibility"]);
      }
    }
  }

  public handleMenuItemClear(element: HTMLElement): void {
    if (element.id.startsWith("menu-item-")) {
      const subMenu = this.getMenuContent(element, ".sub-menu");
      if (subMenu) {
        this.removeStyle(subMenu, ["opacity", "visibility", "top"]);
      }
    }

    const skrimElement = this.dom.querySelector(
      ".header-skrim.opacity-0.d-empty-block"
    ) as HTMLElement;
    if (skrimElement) {
      this.setStyle(skrimElement, { opacity: "0" });
    }
  }

  public handleMegaMenuClear(element: HTMLElement): void {
    if (element.classList.contains("header__menu-li-js")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".mega-menu__content"
      );
      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity"]);
      }
    }
  }

  public handleViairHeaderClear(element: HTMLElement): void {
    if (element.classList.contains("viair-header-link-first-level")) {
      const ViairMegaMenuContent = this.getMenuContent(
        element,
        ".viair-header-mega-menu"
      );
      if (ViairMegaMenuContent) {
        this.removeStyle(ViairMegaMenuContent, ["opacity"]);
        ViairMegaMenuContent.removeAttribute("id");
      }
    }
  }

  public handlePureSportMenuClear(element: HTMLElement): void {
    if (element.classList.contains("ps-relative")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".js-mega-menu_inner"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, { display: "none" }, true);
      }
    }
  }

  public handleAKTMenuClear(element: HTMLElement): void {
    if (element.classList.contains("big:relative")) {
      const megaMenuContent = this.getMenuContent(element, "div");
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, { display: "none" }, true);
        megaMenuContent.removeAttribute("id");
      }
    }
  }

  public handleNubianceHoverClear(element: HTMLElement): void {
    if (element.classList.contains("menu__item")) {
      const subMenu = this.getMenuContent(element, ".header__dropdown");
      if (subMenu) {
        this.removeStyle(subMenu, [
          "opacity",
          "visibility",
          "background",
          "transform",
        ]);
      }
    }
  }

  public handleDeuxMenuItemHoverClear(element: HTMLElement): void {
    if (element.id.startsWith("Details-HeaderMenu-")) {
      const subMenu = this.getMenuContent(element, ".MainOuterCombineBgNav");
      if (subMenu) {
        this.setStyle(subMenu, { display: "none" });
      }
    }
  }
}

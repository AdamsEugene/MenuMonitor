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

  private hasRel(element: HTMLElement): string | undefined {
    return element.getAttribute("rel");
  }

  private getFlowerMenu(element: HTMLElement) {
    let flowerMenuContent: HTMLElement;
    if (
      element.classList.contains("site-nav--is-megamenu") ||
      element.classList.contains("site-nav__item") ||
      element.classList.contains("header__link-nav") ||
      element.classList.contains("menu-item") ||
      element.classList.contains("list-menu-has-child") ||
      element.classList.contains("sublink") ||
      element.classList.contains("cw-cus-header__item") ||
      element.classList.contains("megamenu__nav_item")
    ) {
      flowerMenuContent = this.getMenuContent(
        element,
        ".site-nav__dropdown, .header__meganav, .dropdown-menu, .header-mega-menu, .vertical-menu_submenu, .vertical-menu_sub-submenu, .child, .cw-cus-subNav, .megamenu__submenu, .sub-menu"
      );
    }
    return flowerMenuContent;
  }

  public handleFollowMenu(element: HTMLElement): void {
    if (element.classList.contains("contains-children")) {
      const followMenuContent = this.getMenuContent(element, ".nav-rows");
      if (followMenuContent) {
        this.setStyle(followMenuContent, {
          opacity: "1",
          visibility: "visible",
          "max-height": "max-content",
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleFlowerMenu(element: HTMLElement): void {
    const flowerMenuContent = this.getFlowerMenu(element);
    if (flowerMenuContent) {
      const grandchild = flowerMenuContent.querySelectorAll(".grandchild");
      grandchild.forEach((element) => {
        const listItems = element.querySelectorAll("li");
        listItems.forEach((li) => {
          (li as HTMLElement).style.visibility = "visible";
        });
      });

      this.setStyle(flowerMenuContent, {
        opacity: "1",
        visibility: "visible",
        "pointer-events": "auto",
      });
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

        this.setStyle(ViairMegaMenuContent, {
          opacity: "1",
          "pointer-events": "auto",
        });
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
        this.setStyle(megaMenuContent, {
          opacity: "1",
          "pointer-events": "auto",
        });
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
        this.setStyle(megaMenuContent, {
          display: "flex",
          "pointer-events": "auto",
        });
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
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleDeuxMenuItemHover(element: HTMLElement): void {
    if (element.id.startsWith("Details-HeaderMenu-")) {
      const subMenu = this.getMenuContent(element, ".MainOuterCombineBgNav");
      if (subMenu) {
        this.setStyle(subMenu, { display: "block", "pointer-events": "auto" });
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

        this.setStyle(megaMenuContent, {
          display: "block",
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleFourthMenuItemHover(element: HTMLElement): void {
    if (element.classList.contains("item-ai-dropdown")) {
      const subMenu = this.getMenuContent(element, "ul");
      if (subMenu) {
        this.setStyle(subMenu, {
          opacity: "1",
          visibility: "visible",
          "pointer-events": "auto",
        });
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
          "pointer-events": "auto",
        });
      }
    }
  }

  public handlePlusbogMenuHover(element: HTMLElement) {
    if (element.classList.contains("menu-item-cont")) {
      const mainRel = this.hasRel(element);
      const subMenu = this.getMenuContent(element, ".mega-menu-cont");
      const subRel = this.hasRel(element);
      if (subMenu && mainRel === subRel) {
        this.setStyle(subMenu, { display: "block", "pointer-events": "auto" });
      }
    }
  }

  public handleSaltMenuItemHover(element: HTMLElement): void {
    if (element.classList.contains("nav-item")) {
      const subMenu = this.getMenuContent(element, ".sub-nav");
      if (subMenu) {
        this.setStyle(subMenu, { display: "block", "pointer-events": "auto" });
      }
    }
  }

  public handleCanvasMenuItemHover(element: HTMLElement): void {
    if (element.classList.contains("have_dropdown")) {
      element.classList.add("active_main");
      const subMenu = this.getMenuContent(element, ".drop_menu_container");
      subMenu.classList.add("active_dropdown_menu");
    }
  }

  public handleEssenceMenuItemHover(element: HTMLElement): void {
    if (element.classList.contains("flex-shrink")) {
      const subMenu = this.getMenuContent(element, "div");
      if (subMenu) {
        this.setStyle(subMenu, {
          opacity: "1",
          height: "max-content",
          "pointer-events": "auto",
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
    const flowerMenuContent = this.getFlowerMenu(element);
    if (flowerMenuContent) {
      this.removeStyle(flowerMenuContent, ["opacity", "visibility"]);
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
        this.removeStyle(subMenu, ["display"]);
      }
    }
  }

  public handleFourthMenuItemClear(element: HTMLElement): void {
    if (element.classList.contains("item-ai-dropdown")) {
      const subMenu = this.getMenuContent(element, ".MainOuterCombineBgNav");
      if (subMenu) {
        this.removeStyle(subMenu, ["opacity", "visibility"]);
      }
    }
  }

  public handlePlusbogMenuClear(element: HTMLElement) {
    if (element.classList.contains("menu-item-cont")) {
      const mainRel = this.hasRel(element);
      const subMenu = this.getMenuContent(element, ".mega-menu-cont");
      const subRel = this.hasRel(element);
      if (subMenu && mainRel === subRel) {
        this.removeStyle(subMenu, ["display"]);
      }
    }
  }

  public handleSaltMenuItemClear(element: HTMLElement): void {
    if (element.classList.contains("nav-item")) {
      const subMenu = this.getMenuContent(element, ".sub-nav");
      if (subMenu) {
        this.removeStyle(subMenu, ["display"]);
      }
    }
  }

  public handleCanvasMenuItemClear(element: HTMLElement): void {
    if (element.classList.contains("have_dropdown")) {
      element.classList.remove("active_main");
      const subMenu = this.getMenuContent(element, ".drop_menu_container");
      subMenu.classList.remove("active_dropdown_menu");
    }
  }

  public handleEssenceMenuItemClear(element: HTMLElement): void {
    if (element.classList.contains("flex-shrink")) {
      const subMenu = this.getMenuContent(element, "div");
      if (subMenu) {
        this.removeStyle(subMenu, ["opacity", "height"]);
      }
    }
  }

  public hideAliaPopups(dom: Document): void {
    const divs = dom.querySelectorAll("div");
    divs.forEach((div) => {
      const firstChild = div.firstElementChild;
      if (
        firstChild &&
        firstChild.tagName.toLowerCase() === "iframe" &&
        firstChild.getAttribute("title") === "Alia popup"
      ) {
        this.setStyle(div, { display: "block" });
      }
    });
  }
}

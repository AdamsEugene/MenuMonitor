export default class Specifics {
  private dom: Document;

  constructor(dom: Document) {
    this.dom = dom;
  }

  private stylesToRemove = ["opacity", "visibility"];

  private setStyle(
    element: HTMLElement,
    styles: { [key: string]: string },
    notImportant?: boolean
  ) {
    for (const [property, value] of Object.entries(styles)) {
      if (notImportant) {
        element.style.setProperty(property, value);
      } else element.style.setProperty(property, value, "important");
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
      element.classList.contains("megamenu__nav_item") ||
      element.classList.contains("primary-nav__item") ||
      element.classList.contains("has-submenu") ||
      element.classList.contains("header__nav-item") ||
      element.classList.contains("navigation__item") ||
      element.classList.contains("sf-menu-item") ||
      element.classList.contains("menu-item-has-children") ||
      element.classList.contains("nav-item") ||
      element.classList.contains("HorizontalList__Item") ||
      element.classList.contains("mega-menu")
    ) {
      flowerMenuContent = this.getMenuContent(
        element,
        ".site-nav__dropdown, .header__meganav, .dropdown-menu, .header-mega-menu, .vertical-menu_submenu, .vertical-menu_sub-submenu, .child, .cw-cus-subNav, .megamenu__submenu, .sub-menu, .nav__sub, .submenu, .dropdown, .navigation__child-tier, .sf-menu__submenu, .dropdown-wrap, .DropdownMenu, .mega-menu__content"
      );
    }
    return flowerMenuContent;
  }

  private getFollow(element: HTMLElement) {
    let followMenuContent: HTMLElement;
    if (
      element.classList.contains("contains-children") ||
      element.classList.contains("header-links-item")
    ) {
      followMenuContent = this.getMenuContent(
        element,
        ".nav-rows, .mega-menu-inner, .mega-menu"
      );
    }
    return followMenuContent;
  }

  private getTarget(element: HTMLElement) {
    let subMenu: HTMLElement;
    if (element.id.startsWith("menu-item-")) {
      subMenu = this.getMenuContent(element, ".sub-menu");
    }
    return subMenu;
  }

  private getElementByClass(
    element: HTMLElement,
    selectors: string[],
    subSelectors: string
  ): HTMLElement | null {
    let returnElement: HTMLElement | null = null;
    const hasSelector = selectors.some((selector) =>
      element.classList.contains(selector)
    );
    if (hasSelector) {
      returnElement = this.getMenuContent(element, subSelectors);
    }
    return returnElement;
  }

  private getAtlantaMenu(element: HTMLElement) {
    return this.getElementByClass(
      element,
      ["tt-submenu", "nav-tab-wrapper"],
      ".dropdown-menu, .nav__dropdown"
    );
  }

  public handleFollowMenu(element: HTMLElement): void {
    const followMenuContent = this.getFollow(element);
    if (followMenuContent) {
      this.setStyle(followMenuContent, {
        opacity: "1",
        visibility: "visible",
        "max-height": "max-content",
        "pointer-events": "auto",
      });
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

      let styles: { [x: string]: string } = {
        opacity: "1",
        visibility: "visible",
        height: "max-content",
        "pointer-events": "auto",
      };
      if (flowerMenuContent.classList.contains("sf-menu__submenu")) {
        styles = { ...styles, transform: "translateZ(0)" };
      }

      this.setStyle(flowerMenuContent, { ...styles });
    }
  }

  public handleViairHeader(element: HTMLElement): void {
    if (
      element.classList.contains("viair-header-link-first-level") ||
      element.classList.contains("nav__item")
    ) {
      const ViairMegaMenuContent = this.getMenuContent(
        element,
        ".viair-header-mega-menu, .nav__megamenu"
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

  public handleGodzillaMenu(element: HTMLElement): void {
    if (element.classList.contains("header-navigation__list-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-nav__mega-menu"
      );

      let transform = "matrix(1, 0, 0, 1, 0, 665.219)";
      if (element.querySelector("div")?.textContent === "Explore") {
        transform = "matrix(1, 0, 0, 1, 0, 550.219)";
      }

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          opacity: "1",
          transform,
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleBetterForYouMenu(element: HTMLElement): void {
    if (element.classList.contains("nav__item--has-dropdown")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".nav__dropdown.js-dropdown"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          opacity: "1",
          visibility: "visible",
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleFragrancesMenu(element: HTMLElement): void {
    if (element.tagName.toLowerCase() === "li" && 
        element.parentElement?.classList.contains("fs-navigation-base")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".navigation__submenu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleSnowCosmeticsMenu(element: HTMLElement): void {
    if (element.classList.contains("dropdownMega")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".dropdown-menu.mega-menu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          "opacity": "1",
        });
      }
    }
  }

  public handleAnthrosMenu(element: HTMLElement): void {
    if (element.classList.contains("menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".test.menu_1"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          transform: "scale(1)",
          "top": "93%",
        });
      }
    }
  }

  public handleThickAssGlassMenu(element: HTMLElement): void {
    if (element.classList.contains("navigationBlock__tier--1")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".navigationBlock__megamenu.new_navigationBlock__megamenu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
        });
      }
    }
  }

  public handleModernGentsMenu(element: HTMLElement): void {
    if (element.classList.contains("header-navigation__nav-list-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-navigation__submenu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          display: "block",
        });
      }
    }
  }

  public handleashleystewartMenu(element: HTMLElement): void {
    if (element.classList.contains("menu-lv-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".menu-dropdown"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
        });
      }
    }
  }

  public handlepanalesonlineMenu(element: HTMLElement): void {
    if (element.classList.contains("categoriesMenu")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".categoriesMenu__container"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
        });
      }
    }
  }

  public handlelaligneMenu(element: HTMLElement): void {
    if (element.classList.contains("relative")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".invisible.dropdown-menu-mega"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          opacity: "1",
        });
      }
    }
  }

  public handlesavethegirlMenu(element: HTMLElement): void {
    if (element.classList.contains("m-menu__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".m-mega-menu.m-gradient"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
        });
      }
    }
  }

  public handlepimpantMenu(element: HTMLElement): void {
    if (element.classList.contains("mm-link-container")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".mm-mega-menu-wrapper"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          display: "block",
        });
      }
    }
  }

  public handleCanopyMenu(element: HTMLElement): void {
    if (element.classList.contains("nav__link--megamenu")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".nav__megamenu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          display: "block",
        });
      }
    }
  }

  public handleLaPanaleraMenu(element: HTMLElement): void {
    if (element.classList.contains("nav-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".categoriesMenu__container"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
        });
      }
    }
  }

  public handlePowerleteMenu(element: HTMLElement): void {
    if (element.classList.contains("type_mega")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".sub-menu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          opacity: "1",
          visibility: "visible",
          transform: "none",
        });
      }
    }
  }

  public handleBioLyteMenu(element: HTMLElement): void {
    if (element.classList.contains("gm-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".gm-submenu.gm-mega"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          opacity: "1 !important",
          visibility: "visible !important",
        });
      }
    }
  }

  public handleBebaMenu(element: HTMLElement): void {
    if (element.classList.contains("menu-item-type-taxonomy")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".sub-menu-wrapper"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          transform: "scale(1)",
          "z-index": "30"
        });
      }
    }
  }

  public handleMarshallUniversityMenu(element: HTMLElement): void {
    if (element.classList.contains("group")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".absolute.invisible"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible"
        });
      }
    }
  }

  public handleNolanInteriorMenu(element: HTMLElement): void {
    if (element.classList.contains("js-megamenu-parent")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".ds-menu-desktop__dropdown-level-one.js-megamenu-children"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          height: "auto",
          top: "100%"
        });
      }
    }
  }

  public handleKinnMenu(element: HTMLElement): void {
    if (element.classList.contains("header__menu-item--parent-wrapper")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__menu-item--parent-content.js-header-mega-menu-panel"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible"
        });
      }
    }
  }

  public handleArcticBlueMenu(element: HTMLElement): void {
    if (element.classList.contains("menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".wd-dropdown-menu"
      );

      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          opacity: "1",
          visibility: "visible",
          transform: "none",
        });
      }
    }
  }

  public handleLoomLoftMenu(element: HTMLElement): void {
    if (element.tagName === "LI" && element.className === "") {
        const megaMenuContent = this.getMenuContent(
            element,
            ".widemenu.offcanvasmenusection"
        );

        if (megaMenuContent) {
            this.setStyle(megaMenuContent, {
                display: "block",
            });
        }
    }
  }

  public handleRiflePaperMenu(element: HTMLElement): void {
    if (element.classList.contains("header__secondaryItem")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".megamenu.megamenu--secondary"
      );

      if (megaMenuContent) {
          this.setStyle(megaMenuContent, {
              transform: "translateY(0)",
          });
      }
    }
  }

  public handleRiflePapertopMenu(element: HTMLElement): void {
    if (element.classList.contains("header__mainItem")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".megamenu.megamenu--primary"
      );

      if (megaMenuContent) {
          this.setStyle(megaMenuContent, {
              transform: "translateY(0)",
          });
      }
    }
  }

  public handlee3dMenu(element: HTMLElement): void {
    if (element.classList.contains("buddha-menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".mm-submenu.tree.medium"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          opacity: "1 !important",
          display: "block !important",
          top: "100% !important",
        });
      }
    }
  }

  public handlecheckmybodyhealthMenu(element: HTMLElement): void {
    if (element.classList.contains("submenu") && element.classList.contains("mega-menu")) {
        const megaMenuContent = this.getMenuContent(
            element,
            ".submenu-holder.container--large.submenu-holder--promotion-width-fourth"
        );
        if (megaMenuContent) {
            this.setStyle(megaMenuContent, {
                opacity: "1",
                visibility: "visible",
            });
            
            // Apply styles to parent element
            this.setStyle(element, {
                display: "block",
                opacity: "1",
                visibility: "visible",
                background: "white",
            });
        }
    }
  }

  public handleProjectHoneyBeesMenu(element: HTMLElement): void {
    if (element.classList.contains("nav__item--level-1")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".dropdown"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible"
        });
      }
    }
  }

  public handleArb4x4Menu(element: HTMLElement): void {
    if (element.classList.contains("nav-mega-menu")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".nav-mega-menu__menu.dropdown-menu"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          opacity: "1"
        });
      }
    }
  }

  public handleMedlyMenu(element: HTMLElement): void {
    if (element.classList.contains("header__menus-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__menus-dropdown"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          transform: "scaleY(1) translateY(0)"
        });
      }
    }
  }

  public handleMantraMenu(element: HTMLElement): void {
    if (element.classList.contains("header-menu__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-menu__item-content"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible"
        });
      }
    }
  }

  public handleCosyHouseMenu(element: HTMLElement): void {
    if (element.classList.contains("header__submenu-parent")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__submenu"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
         "max-height": "max-content"
        });
      }
    }
  }

  public handleDripDropMenu(element: HTMLElement): void {
    if (element.classList.contains("menu__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__dropdown"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          opacity: "1"
        });
      }
    }
  }

  public handleQuipMenu(element: HTMLElement): void {
    if (element.classList.contains("menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".menu-item__submenu.menu-item__submenu--mega"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          opacity: "1"
        });
      }
    }
  }

  public handleVeloraMenu(element: HTMLElement): void {
    if (element.classList.contains("group/nav")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".group-megamenu.mega-menu"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          opacity: "1"
        });
      }
    }
  }

  public handleDrIdrissMenu(element: HTMLElement): void {
    if (element.classList.contains("header-navigation__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-dropdown.header-dropdown--two-column.header-dropdown--banner"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          visibility: "visible",
          opacity: "1"
        });
      }
    }
  }

  public handlehockeyshotMenu(element: HTMLElement): void {
    if (element.classList.contains("site-nav__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".site-nav__megamenu"
      );
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, {
          display: "block",
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
    const subMenu = this.getTarget(element);
    if (subMenu) {
      this.setStyle(subMenu, {
        opacity: "1",
        visibility: "visible",
        top: "100%",
        display: "block",
        "pointer-events": "auto",
      });
    }
  }

  public handleDeuxMenuItemHover(element: HTMLElement): void {
    if (
      element.id.startsWith("Details-HeaderMenu-") ||
      element.classList.contains("navbar-item")
    ) {
      const subMenu = this.getMenuContent(
        element,
        ".MainOuterCombineBgNav, .navbar-dropdown"
      );
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
    if (
      element.classList.contains("menu__item") ||
      element.classList.contains("menu-item")
    ) {
      const subMenu = this.getMenuContent(
        element,
        ".header__dropdown, .test.menu_1"
      );

      if (subMenu) {
        const commonStyles = {
          opacity: "1",
          visibility: "visible",
          transform: "scale(1)",
          "pointer-events": "auto",
        };

        if (
          subMenu.classList.contains("test") &&
          subMenu.classList.contains("menu_1")
        ) {
          this.setStyle(subMenu, { ...commonStyles, top: "82.56px" });
        } else {
          this.setStyle(subMenu, {
            ...commonStyles,
            background: "rgb(255, 255, 255)",
          });
        }

        subMenu.classList.add("is-visible");
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
    if (
      element.classList.contains("flex-shrink") ||
      element.classList.contains("items-stretch") ||
      element.classList.contains("parent")
    ) {
      const subMenu = this.getMenuContent(element, "div");
      if (subMenu) {
        this.setStyle(subMenu, {
          opacity: "1",
          visibility: "visible",
          height: "max-content",
          "pointer-events": "auto",
        });
      }
    }
  }

  public handleOberfieldsMenuItemHover(element: HTMLElement): void {
    const subMenu = this.getElementByClass(element, ["drops"], ".dropdown");
    if (subMenu) {
      this.setStyle(subMenu, {
        opacity: "1",
        "max-height": "max-content",
        "pointer-events": "auto",
      });
    }
  }

  public handleCustomMenuItemHover(element: HTMLElement): void {
    const subMenu = this.getElementByClass(
      element,
      ["mega-menu-item", "has-dropdown"],
      ".mega-sub-menu, .mega-menu"
    );
    if (subMenu) {
      this.setStyle(subMenu, {
        opacity: "1",
        visibility: "visible",
        "pointer-events": "auto",
      });
    }
  }

  public handleAtlantaMenuItemHover(element: HTMLElement): void {
    const subMenu = this.getAtlantaMenu(element);
    if (subMenu) {
      this.setStyle(subMenu, {
        display: "block",
        top: "auto",
        "pointer-events": "auto",
      });
    }
  }

  // // // // // // // // // // / / / / / / / // / / / /

  public handleFollowMenuClear(element: HTMLElement): void {
    const followMenuContent = this.getFollow(element);
    if (followMenuContent) {
      this.removeStyle(followMenuContent, [
        "opacity",
        "visibility",
        "max-height",
      ]);
    }
  }

  public handleFlowerMenuClear(element: HTMLElement): void {
    const flowerMenuContent = this.getFlowerMenu(element);
    let styles;
    if (flowerMenuContent) {
      if (flowerMenuContent.classList.contains("sf-menu__submenu")) {
        styles = [...this.stylesToRemove, "transform"];
      } else styles = this.stylesToRemove;

      this.removeStyle(flowerMenuContent, styles);
    }
  }

  public handleMenuItemClear(element: HTMLElement): void {
    const subMenu = this.getTarget(element);
    if (subMenu) {
      this.removeStyle(subMenu, [...this.stylesToRemove, "top", "display"]);
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
    if (
      element.classList.contains("viair-header-link-first-level") ||
      element.classList.contains("nav__item")
    ) {
      const ViairMegaMenuContent = this.getMenuContent(
        element,
        ".viair-header-mega-menu, .nav__megamenu"
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

  public handleGodzillaMenuClear(element: HTMLElement): void {
    if (element.classList.contains("header-navigation__list-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-nav__mega-menu"
      );
      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "transform"]);
      }
    }
  }

  public handleBetterForYouMenuClear(element: HTMLElement): void {
    if (element.classList.contains("nav__item--has-dropdown")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".nav__dropdown.js-dropdown"
      );
      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "visibility"]);
      }
    }
  }

  public handleFragrancesMenuClear(element: HTMLElement): void {
    if (element.tagName.toLowerCase() === "li" && 
        element.parentElement?.classList.contains("fs-navigation-base")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".navigation__submenu"
      );
      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handleSnowCosmeticsMenuclear(element: HTMLElement): void {
    if (element.classList.contains("dropdownMega")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".dropdown-menu.mega-menu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "visibility"]);
      }
    }
  }

  public handleAnthrosMenuclear(element: HTMLElement): void {
    if (element.classList.contains("menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".test.menu_1"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["transform", "top"]);
      }
    }
  }

  public handleThickAssGlassMenuclear(element: HTMLElement): void {
    if (element.classList.contains("navigationBlock__tier--1")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".navigationBlock__megamenu.new_navigationBlock__megamenu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handleModernGentsMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header-navigation__nav-list-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-navigation__submenu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["display"]);
      }
    }
  }

  public handleashleystewartMenuclear(element: HTMLElement): void {
    if (element.classList.contains("menu-lv-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".menu-dropdown"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handlepanalesonlineMenuclear(element: HTMLElement): void {
    if (element.classList.contains("categoriesMenu")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".categoriesMenu__container"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handlelaligneMenuclear(element: HTMLElement): void {
    if (element.classList.contains("relative")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".invisible.dropdown-menu-mega"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "opacity"]);
      }
    }
  }

  public handlesavethegirlMenuclear(element: HTMLElement): void {
    if (element.classList.contains("m-menu__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".m-mega-menu.m-gradient"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handlepimpantMenuclear(element: HTMLElement): void {
    if (element.classList.contains("mm-link-container")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".mm-mega-menu-wrapper"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["display"]);
      }
    }
  }

  public handleCanopyMenuclear(element: HTMLElement): void {
    if (element.classList.contains("nav__link--megamenu")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".nav__megamenu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["display"]);
      }
    }
  }

  public handleLaPanaleraMenuclear(element: HTMLElement): void {
    if (element.classList.contains("nav-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".categoriesMenu__container"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handlePowerleteMenuclear(element: HTMLElement): void {
    if (element.classList.contains("type_mega")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".sub-menu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "visibility", "transform"]);
      }
    }
  }

  public handleBioLyteMenuclear(element: HTMLElement): void {
    if (element.classList.contains("gm-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".gm-submenu.gm-mega"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "visibility"]);
      }
    }
  }


  public handleBebaMenuclear(element: HTMLElement): void {
    if (element.classList.contains("menu-item-type-taxonomy")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".sub-menu-wrapper"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "z-index", "transform"]);
      }
    }
  }

  public handleMarshallUniversityMenuclear(element: HTMLElement): void {
    if (element.classList.contains("group")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".absolute.invisible"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handleNolanInteriorMenuclear(element: HTMLElement): void {
    if (element.classList.contains("js-megamenu-parent")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".ds-menu-desktop__dropdown-level-one.js-megamenu-children"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["height", "top"]);
      }
    }
  }

  public handleKinnMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header__menu-item--parent-wrapper")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__menu-item--parent-content.js-header-mega-menu-panel"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handleArcticBlueMenuclear(element: HTMLElement): void {
    if (element.classList.contains("menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".wd-dropdown-menu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "visibility", "transform"]);
      }
    }
  }

  public handleLoomLoftMenuclear(element: HTMLElement): void {
    if (element.tagName === "LI" && element.className === "") {
        const megaMenuContent = this.getMenuContent(
            element,
            ".widemenu.offcanvasmenusection"
        );

        if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["display"]);
      }
    }
  }

  public handleRiflePaperMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header__secondaryItem")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".megamenu.megamenu--secondary"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["transform"]);
      }
    }
  }

  public handleRiflePapertopMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header__mainItem")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".megamenu.megamenu--primary"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["transform"]);
      }
    }
  }

  public handlee3dMenuclear(element: HTMLElement): void {
    if (element.classList.contains("buddha-menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".mm-submenu.tree.medium"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["opacity", "display", "top"]);
      }
    }
  }

  public handlecheckmybodyhealthMenuclear(element: HTMLElement): void {
    if (element.classList.contains("submenu") && element.classList.contains("mega-menu")) {
        const megaMenuContent = this.getMenuContent(
            element,
            ".submenu-holder.container--large.submenu-holder--promotion-width-fourth"
        );
        if (megaMenuContent) {
            this.removeStyle(megaMenuContent, ["opacity", "visibility"]);
            
            // Remove styles from parent element
            this.removeStyle(element, ["display", "opacity", "visibility", "background"]);
        }
    }
  }

  public handleProjectHoneyBeesMenuclear(element: HTMLElement): void {
    if (element.classList.contains("nav__item--level-1")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".dropdown"
      );
      
      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handleArb4x4Menuclear(element: HTMLElement): void {
    if (element.classList.contains("nav-mega-menu")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".nav-mega-menu__menu.dropdown-menu"
      );
      
      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "opacity"]);
      }
    }
  }

  public handleMedlyMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header__menus-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__menus-dropdown"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "transform"]);
      }
    }
  }

  public handleMantraMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header-menu__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-menu__item-content"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility"]);
      }
    }
  }

  public handleCosyHouseMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header__submenu-parent")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__submenu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "max-height"]);
      }
    }
  }

  public handleDripDropMenuclear(element: HTMLElement): void {
    if (element.classList.contains("menu__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header__dropdown"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "opacity"]);
      }
    }
  }

  public handleQuipMenuclear(element: HTMLElement): void {
    if (element.classList.contains("menu-item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".menu-item__submenu.menu-item__submenu--mega"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "opacity"]);
      }
    }
  }

  public handleVeloraMenuclear(element: HTMLElement): void {
    if (element.classList.contains("group/nav")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".group-megamenu.mega-menu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "opacity"]);
      }
    }
  }

  public handleDrIdrissMenuclear(element: HTMLElement): void {
    if (element.classList.contains("header-navigation__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".header-dropdown.header-dropdown--two-column.header-dropdown--banner"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["visibility", "opacity"]);
      }
    }
  }

  public handlehockeyshotMenuclear(element: HTMLElement): void {
    if (element.classList.contains("site-nav__item")) {
      const megaMenuContent = this.getMenuContent(
        element,
        ".site-nav__megamenu"
      );

      if (megaMenuContent) {
        this.removeStyle(megaMenuContent, ["display"]);
      }
    }
  }


  // public handlegoforthgoodsMenu(element: HTMLElement): void {
  //   if (element.classList.contains("bags") || element.classList.contains("accessories")) {
  //     const megaMenuContent = this.getMenuContent(
  //       element,
  //       ".invisible.dropdown-menu-mega"
  //     );
  //     if (megaMenuContent) {
  //       this.setStyle(megaMenuContent, {
  //         visibility: "visible",
  //         opacity: "1",
  //       });
  //     }
  //   }
  // }


  public handleAKTMenuClear(element: HTMLElement): void {
    if (element.classList.contains("big:relative")) {
      const megaMenuContent = this.getMenuContent(element, "div");
      if (megaMenuContent) {
        this.setStyle(megaMenuContent, { display: "none" }, true);
        megaMenuContent.removeAttribute("id");
      }
    }
  }

  public handleNubianceClear(element: HTMLElement): void {
    if (
      element.classList.contains("menu__item") ||
      element.classList.contains("menu-item")
    ) {
      const subMenu = this.getMenuContent(
        element,
        ".header__dropdown, .test.menu_1"
      );
      if (subMenu) {
        subMenu.classList.remove("is-visible");
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
    if (
      element.id.startsWith("Details-HeaderMenu-") ||
      element.classList.contains("navbar-item")
    ) {
      const subMenu = this.getMenuContent(
        element,
        ".MainOuterCombineBgNav, .navbar-dropdown"
      );
      if (subMenu) {
        this.removeStyle(subMenu, ["display"]);
      }
    }
  }

  public handleFourthMenuItemClear(element: HTMLElement): void {
    if (element.classList.contains("item-ai-dropdown")) {
      const subMenu = this.getMenuContent(element, ".MainOuterCombineBgNav");
      if (subMenu) {
        this.removeStyle(subMenu, this.stylesToRemove);
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
    if (
      element.classList.contains("flex-shrink") ||
      element.classList.contains("items-stretch") ||
      element.classList.contains("parent")
    ) {
      const subMenu = this.getMenuContent(element, "div");
      if (subMenu) {
        this.removeStyle(subMenu, [...this.stylesToRemove, "height"]);
      }
    }
  }

  public handleOberfieldsMenuItemClear(element: HTMLElement): void {
    const subMenu = this.getElementByClass(element, ["drops"], ".dropdown");
    if (subMenu) {
      this.removeStyle(subMenu, ["opacity", "max-height"]);
    }
  }

  public handleCustomMenuItemClear(element: HTMLElement): void {
    const subMenu = this.getElementByClass(
      element,
      ["mega-menu-item", "has-dropdown"],
      ".mega-sub-menu, .mega-menu"
    );
    if (subMenu) {
      this.removeStyle(subMenu, this.stylesToRemove);
    }
  }

  public handleAtlantaMenuItemClear(element: HTMLElement): void {
    const subMenu = this.getAtlantaMenu(element);
    if (subMenu) {
      this.removeStyle(subMenu, ["display", "top"]);
    }
  }

  public headerNavPrimary() {
    let subMenu: HTMLElement;
    const headerNav = this.dom.querySelector(
      ".header__navigation.heading__navigation--primary"
    ) as HTMLElement;

    if (headerNav) {
      subMenu = this.getMenuContent(headerNav, ".bio-hidden.bio-bg-white");
    }
    return subMenu;
  }

  public hideAliaPopups(): void {
    const divs = this.dom.querySelectorAll("div");
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

    const subMenu = this.headerNavPrimary();
    if (subMenu) {
      const newId = "the_id_you_added";
      subMenu.id = newId;

      const style = this.dom.createElement("style");
      style.type = "text/css";
      style.innerHTML = `#${newId} { opacity: 0 !important; }`;
      this.dom.head.appendChild(style);
      this.setStyle(subMenu, { opacity: "0" });
    }
  }

  // public handleB2Menu(element: HTMLElement): void {
  //   const hasOnlyB2Class =
  //     element?.classList.length === 1 && element?.classList.contains("b2");

  //   if (hasOnlyB2Class) {
  //     const megaMenu = this.dom.getElementById(
  //       "theme__navigation-megamenu-injected"
  //     );
  //     const firstChild = megaMenu?.firstElementChild as HTMLElement;

  //     if (firstChild) {
  //       firstChild.style.display = "block";
  //       megaMenu.classList.remove("heatmap-com__hidden-element");
  //     }
  //   }
  // }
}

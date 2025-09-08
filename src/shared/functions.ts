export function getRedirectType():
  | "dashboard"
  | "locala"
  | "deves"
  | "dever"
  | "stage" {
  const url = new URL(window.location.href);
  const hostname = url.hostname;
  if (hostname.includes("localhost")) return "locala";
  if (hostname.includes("dashboard")) return "dashboard";
  if (hostname.includes("portal")) return "dashboard";
  if (hostname.includes("early-release")) return "dever";
  if (hostname.includes("earlystage")) return "deves";
  return "stage";
}

export function getIdSite(): string {
  try {
    const url = window.location.href;

    // Define regex to match ID after /heatmaps/
    const regex = /\/heatmaps\/([^\/]+)/;
    const match = url.match(regex);

    // Check if match exists and has capturing group result
    if (match && match[1]) {
      return match[1];
    }

    // Return empty string if no match found
    return "";
  } catch (error) {
    // Log error for debugging but don't throw to caller
    console.error("Error extracting site ID from URL:", error);
    return "";
  }
}

export function checkForTwoStickyHeaders(dom: Document): HTMLElement | null {
  const ninjamenus1 = dom.querySelector<HTMLElement>("#ninjamenus1");
  if (ninjamenus1) {
    return ninjamenus1;
  }

  const nav__menuholders = dom.querySelector<HTMLElement>(".nav__menu-holder");
  if (nav__menuholders) {
    return nav__menuholders;
  }

  const header_layout_center_split = dom.querySelector<HTMLElement>(".header-layout.header-layout--center-split .header-item.header-item--logo-split");
  if (header_layout_center_split) {
    return header_layout_center_split;
  }

  const ol_desktop_menu_links_header = dom.querySelector<HTMLElement>(".desktop-menu-links-header.hidden ol.flex.flex-row.justify-center");
  if (ol_desktop_menu_links_header) {
    return ol_desktop_menu_links_header;
  }

  const notclone_header = dom.querySelector<HTMLElement>(".clone_header");
  if (notclone_header && notclone_header.nextElementSibling) {
    return notclone_header.nextElementSibling as HTMLElement;
  }

  const header__submenu_top = dom.querySelector<HTMLElement>(".header__submenu_top .header__submenu_categories");
  if (header__submenu_top) {
    return header__submenu_top;
  }

  const list_menu = dom.querySelector<HTMLElement>(".list-menu.list-menu--inline");
  if (list_menu) {
    return list_menu;
  }

  const store_header = dom.querySelector<HTMLElement>("store-header.header");
  if (store_header) {
    return store_header;
  }

  const sc_mega_menu = dom.querySelector<HTMLElement>("sc-mega-menu.justify-between");
  if (sc_mega_menu) {
    return sc_mega_menu;
  }

  const nav_hidden = dom.querySelector<HTMLElement>(".flex.justify-center nav.hidden");
  if (nav_hidden) {
    return nav_hidden;
  }

  const navigation_wrapper = dom.querySelector<HTMLElement>(".navigation-wrapper");
  if (navigation_wrapper) {
    return navigation_wrapper;
  }

  const scrollmenu = dom.querySelector<HTMLElement>(".scrollmenu");
  if (scrollmenu) {
    return scrollmenu;
  }

  const header__container = dom.querySelector<HTMLElement>(".header__container");
  if (header__container) {
    return header__container;
  }

  const primary_menu_container = dom.querySelector<HTMLElement>(".menu-primary-menu-container .menu");
  if (primary_menu_container) {
    return primary_menu_container;
  }

  const header__row_desktop = dom.querySelector<HTMLElement>(".header__row.header__row-desktop.lower.three-segment .header__links-primary-scroll-container.scroll-container-initialized");
  if (header__row_desktop) {
    return header__row_desktop;
  }

  const offcanvastabs = dom.querySelector<HTMLElement>(".tabs.offcanvastabs.navbar-offcanvas.hidden-print");
  if (offcanvastabs) {
    return offcanvastabs;
  }

  const header__secondary = dom.querySelector<HTMLElement>(".shopify-section-group-header-group .header");
  if (header__secondary) {
    return header__secondary;
  }

  const site_nav = dom.querySelector<HTMLElement>(".page-width .site-nav");
  if (site_nav) {
    return site_nav;
  }

  const Nav__First = dom.querySelector<HTMLElement>(".Header__FlexItem.Header__FlexItem--fill .Header__MainNav.Nav__First");
  if (Nav__First) {
    return Nav__First;
  }

  const navigation__tier1 = dom.querySelector<HTMLElement>(
    ".navigation__tier-1-container"
  );
  if (navigation__tier1) {
    return navigation__tier1;
  }

  const headerSection = dom.querySelector<HTMLElement>(
    ".shopify-section.shopify-section-group-header-group.section-header, .header__navigation.hidden-xs.hidden-sm, .section-header.ctnr.ctnr-sm.js-header, .menu-container"
  );
  if (!headerSection) {
    return null;
  }

  const menu = headerSection.querySelector<HTMLElement>(".menu");
  if (menu && menu.classList.length === 1 && menu.classList.contains("menu")) {
    return menu;
  }

  const header_menu_drawer = headerSection.querySelector<HTMLElement>(
    ".header.menu--drawer"
  );
  if (header_menu_drawer) {
    return header_menu_drawer;
  }

  const shell = headerSection.querySelector<HTMLElement>(".shell");
  if (shell) {
    const header__navigation = shell.querySelector<HTMLElement>(
      ".header__navigation-inner"
    );
    if (header__navigation) {
      return header__navigation;
    }
  }

  const stickyHeaders =
    headerSection.querySelectorAll<HTMLElement>("sticky-header");
  return stickyHeaders.length === 2 ? headerSection : null;
}

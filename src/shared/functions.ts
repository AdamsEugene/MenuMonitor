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

  const nav_bar__inner = dom.querySelector<HTMLElement>(".nav-bar__inner .container");
  if (nav_bar__inner) {
    return nav_bar__inner;
  }

  const site_header__element = dom.querySelector<HTMLElement>(".site-header__element.site-header__element--sub.test123");
  if (site_header__element) {
    return site_header__element;
  }

  const main_nav_desktop_only = dom.querySelector<HTMLElement>("main-navigation#main-nav.desktop-only");
  if (main_nav_desktop_only) {
    return main_nav_desktop_only;
  }

  const logo_area = dom.querySelector<HTMLElement>("#pageheader .logo-area.container.container--no-max");
  if (logo_area) {
    return logo_area;
  }

  const site_navigation_small_hide = dom.querySelector<HTMLElement>(".text-center .site-nav.site-navigation");
  if (site_navigation_small_hide) {
    return site_navigation_small_hide;
  }

  const form_header = dom.querySelector<HTMLElement>("form header");
  if (form_header) {
    return form_header;
  }

  const BT5 = dom.querySelector<HTMLElement>(".BT5 nav.navbar.navbar-expand-lg");
  if (BT5) {
    return BT5;
  }

  const header_middle_left = dom.querySelector<HTMLElement>("header.header.header--middle-left.page-width.header--has-menu");
  if (header_middle_left) {
    return header_middle_left;
  }

  const td_nav = dom.querySelector<HTMLElement>(".row.expanded .small-12.columns.td-nav");
  if (td_nav) {
    return td_nav;
  }

  const list_none = dom.querySelector<HTMLElement>("nav.fixed ul.list-none");
  if (list_none) {
    return list_none;
  }

  const section_holder = dom.querySelector<HTMLElement>(".section_holder .header_items");
  if (section_holder) {
    return section_holder;
  }

  const desktop_only = dom.querySelector<HTMLElement>(".desktop-only .navigation.navigation--main");
  if (desktop_only) {
    return desktop_only;
  }

  const nav_btns_desktop = dom.querySelector<HTMLElement>(".nav-btns.desktop .nav.navbar-nav");
  if (nav_btns_desktop) {
    return nav_btns_desktop;
  }

  const bottom_nav__desktop = dom.querySelector<HTMLElement>(".container-fluid.relative .bottom-nav__desktop");
  if (bottom_nav__desktop) {
    return bottom_nav__desktop;
  }


  const mobile_hidden = dom.querySelector<HTMLElement>("#shopify-section-header header nav.py-4.mobile\\:hidden.relative");
  if (mobile_hidden) {
    return mobile_hidden;
  }

  const header_menu_1 = dom.querySelector<HTMLElement>("#header-menu-1.header-menu-1.menu-container");
  if (header_menu_1) {
    return header_menu_1;
  }

  const tmenu_app_horizontal = dom.querySelector<HTMLElement>(".tmenu_wrapper.tmenu--fullwidth nav.tmenu_navbar.tmenu_app.tmenu_initialized.tmenu_transition_none.tmenu_alignment_center.tmenu_skin_undefined.tmenu_app--horizontal");
  if (tmenu_app_horizontal) {
    return tmenu_app_horizontal;
  }

  const header__inline_navigation = dom.querySelector<HTMLElement>(".header__wrapper-center nav.header__inline-navigation.hidden-phone");
  if (header__inline_navigation) {
    return header__inline_navigation;
  }

  const nav__menuholders = dom.querySelector<HTMLElement>(".nav__menu-holder");
  if (nav__menuholders) {
    return nav__menuholders;
  }

  const header__container_bottom = dom.querySelector<HTMLElement>(".container.header__container.header__container--bottom");
  if (header__container_bottom) {
    return header__container_bottom;
  }

  const siteHeader = dom.querySelector<HTMLElement>("header#siteHeader");
  if (siteHeader) {
    return siteHeader;
  }

  const x_headers = dom.querySelectorAll<HTMLElement>("x-header.header.rowabi-none-border-mb");
  if (x_headers.length >= 2) {
    return x_headers[1];
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

  const header_grid_wrapper = dom.querySelector<HTMLElement>(".header_grid_wrapper");
  if (header_grid_wrapper) {
    return header_grid_wrapper;
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

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

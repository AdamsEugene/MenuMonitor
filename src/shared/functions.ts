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
  const url = window.location.href;

  const regex = /\/heatmaps\/([^\/]+)/;
  const match = url.match(regex);

  return match[1];
}

export function checkForTwoStickyHeaders(dom: Document): HTMLElement | null {
  const headerSection = dom.querySelector<HTMLElement>(
    ".shopify-section.shopify-section-group-header-group.section-header"
  );
  if (!headerSection) {
    return null;
  }
  const stickyHeaders =
    headerSection.querySelectorAll<HTMLElement>("sticky-header");
  return stickyHeaders.length === 2 ? headerSection : null;
}

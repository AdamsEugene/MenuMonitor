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

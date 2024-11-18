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
  if (hostname.includes("early-release")) return "dever";
  if (hostname.includes("earlystage")) return "deves";
  return "stage";
}

export const getThis = (item: string) => {
  const parsedUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(parsedUrl.search);
  const hashParams = new URLSearchParams(parsedUrl.hash.slice(1));

  return searchParams.get(item) || hashParams.get(item) || 0;
};

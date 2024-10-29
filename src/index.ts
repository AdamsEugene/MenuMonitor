import MenuMonitor, { MenuMonitorType } from "./new";
// import DOMChangeMonitor, { DOMChangeMonitorType } from "./DOMChangeMonitor.new";
import HoverCapture, { HoverCaptureType } from "./HoverCapture";

declare global {
  interface Window {
    MenuMonitor: HoverCaptureType | MenuMonitorType;
  }
}

const useNewAlgorithm = [
  2548, 1485, 2691, 2779, 2303, 2522, 2384, 1810, 2818, 2816, 2683, 2884, 1781,
  2579, 2869, 1828, 2452,
];

const getThis = (item: string) => {
  const parsedUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(parsedUrl.search);
  const hashParams = new URLSearchParams(parsedUrl.hash.slice(1));

  return searchParams.get(item) || hashParams.get(item) || 0;
};

if (useNewAlgorithm.includes(+getThis("idSite"))) {
  window.MenuMonitor = new HoverCapture();
  window.MenuMonitor.init();
} else {
  window.MenuMonitor = new MenuMonitor();
  window.MenuMonitor.init();
}

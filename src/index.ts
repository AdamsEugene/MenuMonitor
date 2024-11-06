import MenuMonitor, { MenuMonitorType } from "./new";
// import DOMChangeMonitor, { DOMChangeMonitorType } from "./DOMChangeMonitor.new";
import HoverCapture, { HoverCaptureType } from "./HoverCapture";
import { getThis } from "./shared/functions";

declare global {
  interface Window {
    MenuMonitor: HoverCaptureType | MenuMonitorType;
  }
}

const useNewAlgorithm = [
  1485, 2691, 2779, 2303, 2522, 2384, 1810, 2818, 2816, 2683, 2884, 1781, 2579,
  2869, 1828, 2452, 2459, 290, 653, 2643, 1698, 2698, 2931, 2866,
];

if (useNewAlgorithm.includes(+getThis("idSite"))) {
  window.MenuMonitor = new HoverCapture();
  window.MenuMonitor.init();
} else {
  window.MenuMonitor = new MenuMonitor();
  window.MenuMonitor.init();
}

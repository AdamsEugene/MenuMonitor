import MenuMonitor, { MenuMonitorType } from "./new";
// import DOMChangeMonitor, { DOMChangeMonitorType } from "./DOMChangeMonitor.new";
import HoverCapture, { HoverCaptureType } from "./HoverCapture";
import { getIdSite } from "./shared/functions";

declare global {
  interface Window {
    MenuMonitor: HoverCaptureType | MenuMonitorType;
  }
}

const useNewAlgorithm = [
  1485, 2691, 2779, 2303, 2522, 2384, 1810, 2818, 2816, 2683, 2884, 1781, 2579,
  2869, 1828, 2452, 2459, 290, 653, 2643, 1698, 2698, 2931, 2866, 2950, 181,
  172, 1462, 1387, 1555, 1788, 1901, 1934, 1952, 2019, 2983, 2982, 2979, 2976,
  2975, 2974, 2970, 2941, 2920, 2913, 2908, 2906, 2904, 2893, 2886, 1914, 2882,
  2830, 2881, 2863, 3004, 2846, 2823, 2815, 2784, 2776, 2774, 2766, 2764, 2759,
  2749, 2744, 2742, 2827, 2739, 2872, 1425, 2723, 2690, 2684, 3014, 699, 586,
  3264, 3103,
];

if (useNewAlgorithm.includes(+getIdSite())) {
  window.MenuMonitor = new HoverCapture();
  window.MenuMonitor.init();
} else {
  window.MenuMonitor = new MenuMonitor();
  window.MenuMonitor.init();
}

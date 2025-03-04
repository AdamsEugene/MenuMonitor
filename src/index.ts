import MenuMonitor, { MenuMonitorType } from "./new";
// import DOMChangeMonitor, { DOMChangeMonitorType } from "./DOMChangeMonitor.new";
import HoverCapture, { HoverCaptureType } from "./HoverCapture";
import { getIdSite } from "./shared/functions";

declare global {
  interface Window {
    MenuMonitor: HoverCaptureType | MenuMonitorType;
    MenuMonitorManager: MenuMonitorManager;
  }
}

const useNewAlgorithm = [
  1485, 2691, 2779, 2303, 2522, 2384, 1810, 2818, 2816, 2683, 2884, 1781, 2579,
  2869, 1828, 2452, 2459, 290, 653, 2643, 1698, 2698, 2931, 2866, 2950, 181,
  172, 1462, 1387, 1555, 1788, 1901, 1934, 1952, 2019, 2983, 2982, 2979, 2976,
  2975, 2974, 2970, 2941, 2920, 2913, 2908, 2906, 2904, 2893, 2886, 1914, 2882,
  2830, 2881, 2863, 3004, 2846, 2823, 2815, 2784, 2776, 2774, 2766, 2764, 2759,
  2749, 2744, 2742, 2827, 2739, 2872, 1425, 2723, 2690, 2684, 3014, 699, 586,
  3264, 3103, 3212, 3250,
];

class MenuMonitorManager {
  private _customIdSite: number | null = null;
  private initialized = false;

  constructor() {
    // Don't initialize in constructor
    // Let the user call init() explicitly as per existing pattern
  }

  /**
   * Set a custom idSite value
   * @param idSite The site ID to use
   * @returns The current instance for method chaining
   */
  public setIdSite(idSite: number): MenuMonitorManager {
    this._customIdSite = idSite;

    // If we've already initialized with a different ID, reinitialize
    if (this.initialized) {
      this.reinitialize();
    } else {
      this.init();
    }

    return this;
  }

  /**
   * Get the current idSite value
   * @returns The current idSite value (custom or from getIdSite())
   */
  public getIdSite(): number {
    return this._customIdSite !== null ? this._customIdSite : +getIdSite();
  }

  /**
   * Initialize the MenuMonitor based on the current idSite
   */
  public init(): void {
    if (this.initialized) {
      return;
    }

    const idSite = this.getIdSite();

    if (useNewAlgorithm.includes(idSite)) {
      window.MenuMonitor = new HoverCapture();
      console.log("====================================");
      console.log("HoverCapture");
      console.log("====================================");
    } else {
      window.MenuMonitor = new MenuMonitor();
      console.log("====================================");
      console.log("MenuMonitor");
      console.log("====================================");
    }

    window.MenuMonitor.init();
    this.initialized = true;
  }

  /**
   * Reinitialize the MenuMonitor with the current idSite
   */
  private reinitialize(): void {
    // Simply reassign and reinitialize the MenuMonitor
    // No destroy method is called as it doesn't exist

    this.initialized = false;
    this.init();
  }
}

// Create and expose the class
window.MenuMonitorManager = new MenuMonitorManager();

// // Export the class, not an instance
// export default MenuMonitorManager;

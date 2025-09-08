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
  2749, 2744, 2742, 2827, 2739, 2872, 1425, 2723, 2690, 2684, 3014, 699, 3069,
  3056, 3122, 586, 3066, 3095, 2955, 2972, 3055, 3124, 3117, 3147, 3146, 3114, 
  3166, 3161, 3103, 3167, 3182, 3183, 3207, 3204, 3264, 3250, 3367, 3241, 3156,
  3268, 3421, 3386, 3327, 3427, 2850, 2121, 3445, 3450, 3179, 3278, 3466, 3385,
  1551, 3193, 3402, 3287, 3511, 3529, 3532, 3537, 3556, 3640, 3639, 3632, 3631,
  3457, 3644, 3648, 3651, 3653, 3655, 2694, 3811, 3566, 3665, 3668, 3671, 3685,
  3680, 3845, 3866, 3862, 1533, 3886, 3924, 3919, 3917, 2182, 3910, 3904, 3643,
  2951, 3934, 3957, 3955, 3989, 4026, 4037, 4042, 4031, 4018, 4017, 3985, 2545,
  4059, 4063, 4069, 4072, 4084, 4083, 4124, 4080, 4076, 4119, 4171, 4172, 4164,
  4163, 4205, 4139, 4147, 3936, 4151, 4212, 4213, 4240, 4255, 4252, 4275, 4273,
  4270, 4267, 4263, 4251, 3993, 4301, 4339, 4309, 4347, 4440, 4447, 4422, 4412,
  4398, 4401, 4377, 4458
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

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
  4398, 4401, 4377, 4458, 4353, 4352, 4362, 4365, 4474, 4472, 4467, 4466, 4326,
  4475, 4477, 4496, 4478, 4495, 4491, 4509, 4524, 4537, 4110, 4552, 4561, 4560,
  4551, 4554, 4506, 4569, 4568, 4563, 4575, 4598, 4622, 4693, 3978, 4709, 4632,
  4639, 4643, 4650, 4675, 4666, 2420, 4593, 4645, 4719, 4331, 2533, 3681, 3060,
  3215, 2100, 3898, 4724, 4333, 4728, 3468, 4733, 4665, 4763, 4834, 1888, 2603,
  2994, 4782, 4750, 2045, 4784, 4789, 4841, 3437, 4813, 4325, 4729, 4834, 4815,
  4803, 4793, 4792, 4725, 4885, 4883, 2296, 2977, 1927, 3337, 4807, 1417, 3160,
  3490, 3491, 2681, 3401, 4540, 2740, 1906, 4504, 4812, 4594, 1834, 3183, 4033,
  2503, 4273, 2683, 2204, 4910, 440, 3680, 3184, 2481, 2271, 4131, 4843, 2538,
  2998, 3559, 438, 4915, 2521, 4285, 4628, 1652, 2923, 2116, 3573, 3821, 4906,
  3909, 715, 3625
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

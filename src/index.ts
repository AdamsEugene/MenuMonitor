// import MenuMonitor, { MenuMonitorType } from "./main";
import DOMChangeMonitor, { DOMChangeMonitorType } from "./DOMChangeMonitor.new";

declare global {
  interface Window {
    MenuMonitor: DOMChangeMonitorType;
  }
}

window.MenuMonitor = new DOMChangeMonitor();
window.MenuMonitor.init();

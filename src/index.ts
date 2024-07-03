import MenuMonitor, { MenuMonitorType } from "./new";

declare global {
  interface Window {
    MenuMonitor: MenuMonitorType;
  }
}

window.MenuMonitor = new MenuMonitor();
window.MenuMonitor.init();

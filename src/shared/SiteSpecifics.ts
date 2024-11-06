export default class SiteSpecifics {
  private dom: Document;

  constructor(dom: Document) {
    this.dom = dom;
  }

  public updateMegaMenuScale(element: HTMLElement, scale: 1 | 0) {
    if (!scale) element.style.removeProperty("transform");
    else element.style.setProperty("transform", `scaleY(${scale})`);
  }

  public getScaleValues(element: HTMLElement, close?: boolean) {
    if (element && +this.getThis("idSite") === 2861) {
      if (close) {
        element.style.setProperty("transform", "scale(0)");
        return;
      }
      const computedStyle = window.getComputedStyle(element);
      const transformValue = computedStyle.transform;
      if (transformValue !== "none") {
        const matrixValues = transformValue.match(/matrix\(([^)]+)\)/);
        const scaleValues = transformValue.match(/scale\(([^)]+)\)/);

        if (matrixValues) {
          const values = matrixValues[1].split(",").map(Number);
          const scaleX = values[0];
          const scaleY = values[3];

          if (scaleX < 1 || scaleY < 1)
            element.style.setProperty("transform", "scale(1)", "important");
        } else if (scaleValues) {
          const scales = scaleValues[1].split(",").map(Number);
          if (scales[0] < 1)
            element.style.setProperty("transform", "scale(1)", "important");
        }
      }
    }
  }

  public getThis(item: string) {
    const parsedUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(parsedUrl.search);
    const hashParams = new URLSearchParams(parsedUrl.hash.slice(1));

    return searchParams.get(item) || hashParams.get(item) || 0;
  }
}

// Shared by the hero grid and its finale, so both lay out the same boxes

export const HERO_BOX_SIZE = 26;

export interface GridPoint {
  x: number;
  y: number;
}

export function appendDiv(
  parent: HTMLElement,
  ...classNames: string[]
): HTMLDivElement {
  const el = document.createElement("div");
  el.classList.add(...classNames);
  parent.appendChild(el);
  return el;
}

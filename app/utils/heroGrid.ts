// Shared by the hero grid and its finale, so both lay out the same boxes

export const HERO_BOX_SIZE = 26;

export interface GridPoint {
  x: number;
  y: number;
}

export interface GridMetrics {
  cols: number;
  offsetX: number;
  offsetY: number;
  rows: number;
  spacingX: number;
  spacingY: number;
}

export interface StrikeLine {
  angle: number;
  length: number;
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

// Spread whole cells evenly over the area
export function getGridMetrics(
  width: number,
  height: number,
  spacing: number
): GridMetrics {
  const cols = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);
  const spacingX = width / cols;
  const spacingY = height / rows;

  return {
    cols,
    offsetX: (width - cols * spacingX) / 2,
    offsetY: (height - rows * spacingY) / 2,
    rows,
    spacingX,
    spacingY,
  };
}

// Index of the box nearest to the point, -1 outside the grid
export function getCellIndexAt(point: GridPoint, grid: GridMetrics): number {
  const { cols, offsetX, offsetY, rows, spacingX, spacingY } = grid;
  const col = Math.round((point.x - offsetX - HERO_BOX_SIZE / 2) / spacingX);
  const row = Math.round((point.y - offsetY - HERO_BOX_SIZE / 2) / spacingY);
  const isInside = col >= 0 && col < cols && row >= 0 && row < rows;
  return isInside ? row * cols + col : -1;
}

// Runs from half a box before the first box centre to half a box past the last
export function getStrikeLine(first: GridPoint, last: GridPoint): StrikeLine {
  const angle = Math.atan2(last.y - first.y, last.x - first.x);
  const overshoot = HERO_BOX_SIZE / 2;
  return {
    angle,
    length: Math.hypot(last.x - first.x, last.y - first.y) + HERO_BOX_SIZE,
    x: first.x + overshoot - Math.cos(angle) * overshoot,
    y: first.y + overshoot - Math.sin(angle) * overshoot,
  };
}

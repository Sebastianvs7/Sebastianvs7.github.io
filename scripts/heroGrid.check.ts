// Self-check for app/utils/heroGrid.ts: `node scripts/heroGrid.check.ts` (Node 24), silent on success
import assert from "node:assert/strict";

import {
  getCellIndexAt,
  getGridMetrics,
  getStrikeLine,
  HERO_BOX_SIZE,
} from "../app/utils/heroGrid.ts";

const HALF_BOX = HERO_BOX_SIZE / 2;

// Grid metrics: whole cells spread evenly over the area
{
  assert.deepEqual(getGridMetrics(800, 200, 40), {
    cols: 20,
    offsetX: 0,
    offsetY: 0,
    rows: 5,
    spacingX: 40,
    spacingY: 40,
  });
}
{
  const grid = getGridMetrics(810, 210, 40);
  assert.equal(grid.cols, 21, "a partial column still gets a cell");
  assert.equal(grid.rows, 6);
  assert.equal(grid.spacingX, 810 / 21);
  assert.equal(grid.spacingY, 35);
}

// Cell index: the box nearest to the point, -1 outside the grid
{
  const grid = getGridMetrics(800, 200, 40);
  assert.equal(getCellIndexAt({ x: HALF_BOX, y: HALF_BOX }, grid), 0);
  assert.equal(
    getCellIndexAt({ x: 3 * 40 + HALF_BOX, y: 2 * 40 + HALF_BOX }, grid),
    2 * 20 + 3
  );
  assert.equal(
    getCellIndexAt({ x: 19 * 40 + HALF_BOX, y: 4 * 40 + HALF_BOX }, grid),
    99,
    "last cell"
  );
  assert.equal(getCellIndexAt({ x: -30, y: HALF_BOX }, grid), -1, "left");
  assert.equal(
    getCellIndexAt({ x: HALF_BOX, y: 5 * 40 + HALF_BOX }, grid),
    -1,
    "below"
  );
}

// Strike line: from half a box before the first box centre to half a box past the last
{
  assert.deepEqual(getStrikeLine({ x: 0, y: 0 }, { x: 160, y: 0 }), {
    angle: 0,
    length: 160 + HERO_BOX_SIZE,
    x: 0,
    y: HALF_BOX,
  });
}
{
  const strike = getStrikeLine({ x: 0, y: 0 }, { x: 0, y: 160 });
  assert.equal(strike.angle, Math.PI / 2);
  assert.equal(strike.length, 160 + HERO_BOX_SIZE);
  assert.ok(Math.abs(strike.x - HALF_BOX) < 1e-9, "vertical x");
  assert.ok(Math.abs(strike.y) < 1e-9, "vertical y");
}

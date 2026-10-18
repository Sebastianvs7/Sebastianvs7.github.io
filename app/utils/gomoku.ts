// Gomoku (five in a row) rules and computer opponent.
// Pure and immutable: every move returns a new game, so UI renders from state.

export type GomokuMark = "o" | "x";
export type GomokuCell = GomokuMark | null;
export type GomokuStatus =
  | "computerTurn"
  | "draw"
  | "lost"
  | "playerTurn"
  | "won";

export interface GomokuGame {
  board: readonly GomokuCell[];
  cols: number;
  rows: number;
  status: GomokuStatus;
  winningLine: readonly number[];
}

type Direction = readonly [dRow: number, dCol: number];

const PLAYER: GomokuMark = "o";
const COMPUTER: GomokuMark = "x";
const WIN_LENGTH = 5;
// Moves further than this from any mark never matter in gomoku
const SEARCH_RADIUS = 2;
// Horizontal, vertical, diagonal ↘, diagonal ↗
const DIRECTIONS: readonly Direction[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
];
// Score of a winnable 5-cell window by how many own marks it already holds
const WINDOW_SCORES = [1, 10, 100, 1000, 10000];
// How much the computer cares about the player's lines next to its own.
// Low on purpose: it still blocks fours, but lets open threes through,
// so a casual player can win
const DEFENSE_WEIGHT = 0.08;

export function createGomokuGame(cols: number, rows: number): GomokuGame {
  return {
    board: Array<GomokuCell>(cols * rows).fill(null),
    cols,
    rows,
    status: "playerTurn",
    winningLine: [],
  };
}

// Ignored (same game returned) unless it is the player's turn and the cell is empty
export function playerMove(game: GomokuGame, index: number): GomokuGame {
  if (game.status !== "playerTurn" || game.board[index] !== null) return game;
  return placeMark(game, index, PLAYER);
}

// Ignored (same game returned) unless it is the computer's turn
export function computerMove(game: GomokuGame): GomokuGame {
  if (game.status !== "computerTurn") return game;
  return placeMark(game, pickComputerCell(game), COMPUTER);
}

function placeMark(
  game: GomokuGame,
  index: number,
  mark: GomokuMark,
): GomokuGame {
  const next = { ...game, board: withMark(game.board, index, mark) };
  const winningLine = findWinningLine(next, index);

  if (winningLine) {
    return { ...next, status: mark === PLAYER ? "won" : "lost", winningLine };
  }
  if (!next.board.includes(null)) return { ...next, status: "draw" };
  return { ...next, status: mark === PLAYER ? "computerTurn" : "playerTurn" };
}

function withMark(
  board: readonly GomokuCell[],
  index: number,
  mark: GomokuMark,
): GomokuCell[] {
  const next = [...board];
  next[index] = mark;
  return next;
}

// The only place that turns coordinates into indices, so lines never wrap rows
function offset(
  game: GomokuGame,
  index: number,
  dRow: number,
  dCol: number,
): number {
  const row = Math.floor(index / game.cols) + dRow;
  const col = (index % game.cols) + dCol;
  const isInside = row >= 0 && row < game.rows && col >= 0 && col < game.cols;
  return isInside ? row * game.cols + col : -1;
}

function findWinningLine(game: GomokuGame, index: number): number[] | null {
  const mark = game.board[index];
  if (!mark) return null;

  for (const [dRow, dCol] of DIRECTIONS) {
    const line = [index];
    for (const sign of [1, -1]) {
      for (let step = 1; ; step++) {
        const cell = offset(game, index, dRow * step * sign, dCol * step * sign);
        if (cell === -1 || game.board[cell] !== mark) break;
        line.push(cell);
      }
    }
    if (line.length >= WIN_LENGTH) return line.sort((a, b) => a - b);
  }
  return null;
}

// Forced moves first (win now, then stop the player's win), otherwise best heuristic
function pickComputerCell(game: GomokuGame): number {
  const candidates = getCandidates(game);

  return (
    candidates.find((index) => isWinningCell(game, index, COMPUTER)) ??
    candidates.find((index) => isWinningCell(game, index, PLAYER)) ??
    maxBy(
      candidates,
      (index) =>
        scoreCell(game, index, COMPUTER) +
        DEFENSE_WEIGHT * scoreCell(game, index, PLAYER),
    )
  );
}

// Empty cells near any mark; all empty cells if none (only on a sparse board)
function getCandidates(game: GomokuGame): number[] {
  const empty = game.board.flatMap((cell, index) =>
    cell === null ? [index] : [],
  );
  const near = empty.filter((index) => hasMarkNearby(game, index));
  return near.length > 0 ? near : empty;
}

function hasMarkNearby(game: GomokuGame, index: number): boolean {
  for (let dRow = -SEARCH_RADIUS; dRow <= SEARCH_RADIUS; dRow++) {
    for (let dCol = -SEARCH_RADIUS; dCol <= SEARCH_RADIUS; dCol++) {
      const cell = offset(game, index, dRow, dCol);
      if (cell !== -1 && game.board[cell] !== null) return true;
    }
  }
  return false;
}

function isWinningCell(
  game: GomokuGame,
  index: number,
  mark: GomokuMark,
): boolean {
  const board = withMark(game.board, index, mark);
  return findWinningLine({ ...game, board }, index) !== null;
}

// Sums every 5-cell window through `index` that `mark` can still complete.
// Windows handle gaps (o.oo) and blocked ends uniformly, without pattern tables.
function scoreCell(game: GomokuGame, index: number, mark: GomokuMark): number {
  let score = 0;

  for (const [dRow, dCol] of DIRECTIONS) {
    for (let start = -(WIN_LENGTH - 1); start <= 0; start++) {
      let count = 0;
      let isOpen = true;
      for (let step = start; step < start + WIN_LENGTH && isOpen; step++) {
        const cell = offset(game, index, dRow * step, dCol * step);
        const content = cell === -1 ? undefined : game.board[cell];
        if (content === mark) count++;
        else if (content !== null) isOpen = false; // edge or opponent
      }
      if (isOpen) score += WINDOW_SCORES[count] ?? 0;
    }
  }
  return score;
}

// First item wins ties, so the choice is deterministic
function maxBy(items: number[], getScore: (item: number) => number): number {
  let best = items[0] ?? -1;
  let bestScore = -Infinity;
  for (const item of items) {
    const score = getScore(item);
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

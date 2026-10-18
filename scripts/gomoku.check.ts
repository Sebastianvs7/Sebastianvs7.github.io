// Self-check for app/utils/gomoku.ts: `node scripts/gomoku.check.ts` (Node 24), silent on success
import assert from "node:assert/strict";

import {
  computerMove,
  createGomokuGame,
  playerMove,
} from "../app/utils/gomoku.ts";
import type {
  GomokuCell,
  GomokuGame,
  GomokuStatus,
} from "../app/utils/gomoku.ts";

// "." empty, "o" player, "x" computer; every row the same length
function gameFrom(
  rows: string[],
  status: GomokuStatus = "playerTurn",
): GomokuGame {
  const board = [...rows.join("")].map((char): GomokuCell => {
    if (char === "o" || char === "x") return char;
    return null;
  });
  return {
    board,
    cols: rows[0]?.length ?? 0,
    rows: rows.length,
    status,
    winningLine: [],
  };
}

function cellsOf(game: GomokuGame, mark: GomokuCell): number[] {
  return game.board.flatMap((cell, index) => (cell === mark ? [index] : []));
}

// Player moves and turn order
{
  const game = createGomokuGame(10, 5);
  const next = playerMove(game, 12);
  assert.equal(next.board[12], "o");
  assert.equal(next.status, "computerTurn");
  assert.equal(game.board[12], null, "original game is untouched");
  assert.equal(playerMove(next, 13), next, "not the player's turn");
}
{
  const game = gameFrom(["o........."]);
  assert.equal(playerMove(game, 0), game, "occupied cell");
  assert.equal(playerMove(game, -1), game, "outside the board");
  assert.equal(playerMove(game, 10), game, "outside the board");
}

// Win detection
{
  const won = playerMove(
    gameFrom(["..........", ".oo.oo....", ".........."]),
    13,
  );
  assert.equal(won.status, "won");
  assert.deepEqual(won.winningLine, [11, 12, 13, 14, 15]);
  assert.equal(playerMove(won, 0), won, "game is over");
}
{
  const game = gameFrom([
    "o.........",
    ".o........",
    "..........",
    "...o......",
    "....o.....",
  ]);
  assert.deepEqual(playerMove(game, 22).winningLine, [0, 11, 22, 33, 44]); // diagonal ↘
}
{
  const game = gameFrom([
    "....o.....",
    "...o......",
    "..........",
    ".o........",
    "o.........",
  ]);
  assert.deepEqual(playerMove(game, 22).winningLine, [4, 13, 22, 31, 40]); // diagonal ↗
}
{
  const game = gameFrom(["o....", "o....", "o....", "o....", "....."]);
  assert.deepEqual(playerMove(game, 20).winningLine, [0, 5, 10, 15, 20]); // vertical
}
{
  // 6, 10, 14, 18, 22 step by cols - 1 but wrap at the right edge
  const game = gameFrom([".....", ".o...", "o...o", "...o.", "....."]);
  assert.equal(
    playerMove(game, 22).status,
    "computerTurn",
    "no ↗ line across the edge",
  );
}
{
  const game = gameFrom([".......oo.", "oo........"]);
  assert.equal(
    playerMove(game, 9).status,
    "computerTurn",
    "no line across rows",
  );
}
{
  const game = gameFrom(["ooo.oo...."]);
  assert.deepEqual(
    playerMove(game, 3).winningLine,
    [0, 1, 2, 3, 4, 5],
    "overline wins",
  );
}
{
  const game = gameFrom(["ooxo.o...."]);
  assert.equal(
    playerMove(game, 4).status,
    "computerTurn",
    "opponent breaks the line",
  );
}
{
  const game = gameFrom(["oxo", "xo."]);
  assert.equal(playerMove(game, 5).status, "draw");
}

// Computer opponent
{
  const game = gameFrom(
    ["..........", ".xxxx.....", ".oooo.....", ".........."],
    "computerTurn",
  );
  const next = computerMove(game);
  assert.equal(next.status, "lost", "takes its own win over blocking");
  assert.deepEqual(next.winningLine.length, 5);
}
{
  const game = gameFrom(
    ["..........", "xoooo.....", ".........."],
    "computerTurn",
  );
  assert.deepEqual(cellsOf(computerMove(game), "x"), [10, 15], "blocks a four");
}
{
  const game = gameFrom(
    ["..........", ".oo.oo....", "....x....."],
    "computerTurn",
  );
  assert.equal(computerMove(game).board[13], "x", "blocks a broken four");
}
{
  const game = gameFrom(
    ["..........", "..........", "...ooo....", "..........", ".........."],
    "computerTurn",
  );
  const [move] = cellsOf(computerMove(game), "x");
  assert.ok(move === 22 || move === 26, `blocks an open three, played ${move}`);
}
{
  // Easy on purpose: it builds its own line instead of answering an open three
  const game = gameFrom(
    ["..........", "..xx......", "..........", "...ooo....", ".........."],
    "computerTurn",
  );
  const [move] = cellsOf(computerMove(game), "x").filter(
    (cell) => game.board[cell] === null,
  );
  assert.ok(move === 11 || move === 14, `extends its own two, played ${move}`);
}
{
  const game = gameFrom(
    ["..........", "..........", "...o......", "..........", ".........."],
    "computerTurn",
  );
  const next = computerMove(game);
  assert.equal(cellsOf(next, "x").length, 1);
  assert.equal(next.status, "playerTurn");
}
{
  const game = gameFrom(["oxo", "xo."], "computerTurn");
  assert.equal(
    computerMove(game).status,
    "draw",
    "computer fills the last cell",
  );
}
{
  const game = gameFrom(["o........."]);
  assert.equal(computerMove(game), game, "not the computer's turn");
}

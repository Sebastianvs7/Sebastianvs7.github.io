import { computerMove, createGomokuGame, playerMove } from "~/utils/gomoku";
import type { GomokuGame, GomokuMark, GomokuStatus } from "~/utils/gomoku";
import { getCellIndexAt, getStrikeLine, HERO_BOX_SIZE } from "~/utils/heroGrid";
import type { GridPoint, StrikeLine } from "~/utils/heroGrid";

import type { HeroGrid } from "./useHeroGrid";

export interface FinaleStart {
  from: GridPoint[];
  origin: GridPoint;
}

export interface GameMarkView {
  index: number;
  player: GomokuMark;
  // Position in the winning line, -1 for marks outside it
  winOrder: number;
  x: number;
  y: number;
}

// idle: no game, playing: moves left, over: won, lost or drawn
export type GamePhase = "idle" | "over" | "playing";

export interface MatchScore {
  computer: number;
  player: number;
}

interface GomokuMatch {
  finaleStart: ShallowRef<FinaleStart | null>;
  game: ShallowRef<GomokuGame | null>;
  isGridAway: Ref<boolean>;
  isHoverPlayable: ComputedRef<boolean>;
  isScoreVisible: ComputedRef<boolean>;
  marks: ComputedRef<GameMarkView[]>;
  phase: ComputedRef<GamePhase>;
  resultKey: ComputedRef<string | undefined>;
  revealStyle: ComputedRef<Record<string, string>>;
  score: Ref<MatchScore>;
  strike: ComputedRef<StrikeLine | null>;
  handleFinaleDone: () => void;
  handleGameClear: () => void;
  handleHeroClick: (e: MouseEvent) => void;
  handleHeroPointerMove: (e: PointerEvent) => void;
  handleStrikeEnd: () => void;
}

// Pause before the computer answers, so its move reads as a reply
const COMPUTER_MOVE_DELAY = 400;
// Win reveal timing in seconds, passed to the styles through revealStyle
const SWIRL_STAGGER = 0.1;
const SWIRL_DURATION = 0.6;
const STRIKE_DURATION = 0.35;
// Wins that end a match, then the score starts over
const FINALE_WINS = 3;
const SWAPPED_MARKS: Record<GomokuMark, GomokuMark> = { o: "x", x: "o" };
const GAME_RESULT_KEYS: Partial<Record<GomokuStatus, string>> = {
  draw: "gomoku.draw",
  lost: "gomoku.lost",
  won: "gomoku.won",
};

// Gomoku against the computer on the hero grid, scored over a match of FINALE_WINS
export const useGomokuMatch = (
  heroRef: Ref<HTMLElement | null>,
  grid: HeroGrid
): GomokuMatch => {
  // null while the game is off; the board maps 1:1 onto grid.boxes
  const game = shallowRef<GomokuGame | null>(null);
  // Where the finale starts, set while it plays
  const finaleStart = shallowRef<FinaleStart | null>(null);
  // The real grid hides while its copies fly and drop back, until they land
  const isGridAway = ref(false);
  const score = ref<MatchScore>({ computer: 0, player: 0 });
  const hoverIndex = ref(-1);
  // A finished game clears on a grid click once its reveal has played, like the Clear button
  const isClearable = ref(false);
  // Set by starting on an idle cross, kept for the match; the board still stores "o" for the player
  const isPlayingCrosses = ref(false);

  let computerMoveTimer: ReturnType<typeof setTimeout> | undefined;
  let clearableTimer: ReturnType<typeof setTimeout> | undefined;

  // Set once the game has ended, so it also tells whether it has
  const resultKey = computed(() =>
    game.value ? GAME_RESULT_KEYS[game.value.status] : undefined
  );

  const phase = computed<GamePhase>(() => {
    if (!game.value) return "idle";
    return resultKey.value ? "over" : "playing";
  });

  const isScoreVisible = computed(
    () => game.value !== null || score.value.computer + score.value.player > 0
  );

  const isHoverPlayable = computed(() => {
    if (hoverIndex.value === -1 || finaleStart.value) return false;
    if (!game.value || isClearable.value) return true;
    return (
      game.value.status === "playerTurn" &&
      game.value.board[hoverIndex.value] === null
    );
  });

  const marks = computed<GameMarkView[]>(() => {
    const current = game.value;
    if (!current) return [];

    return current.board.flatMap((player, index) => {
      const box = grid.boxes.value[index];
      if (!player || !box) return [];
      const winOrder = current.winningLine.indexOf(index);
      return [
        {
          index,
          player: isPlayingCrosses.value ? SWAPPED_MARKS[player] : player,
          winOrder,
          x: box.x,
          y: box.y,
        },
      ];
    });
  });

  const strike = computed<StrikeLine | null>(() => {
    const line = game.value?.winningLine ?? [];
    const first = grid.boxes.value[line[0] ?? -1];
    const last = grid.boxes.value[line.at(-1) ?? -1];
    return first && last ? getStrikeLine(first, last) : null;
  });

  const getStrikeDelay = (lineLength: number) =>
    (lineLength - 1) * SWIRL_STAGGER + SWIRL_DURATION;

  // The strike waits for the last swirl, Clear waits for the strike
  const revealStyle = computed((): Record<string, string> => {
    const count = game.value?.winningLine.length ?? 0;
    if (count === 0) return {};

    const strikeDelay = getStrikeDelay(count);
    return {
      "--reveal-delay": `${strikeDelay + STRIKE_DURATION}s`,
      "--strike-delay": `${strikeDelay}s`,
      "--strike-duration": `${STRIKE_DURATION}s`,
      "--swirl-duration": `${SWIRL_DURATION}s`,
      "--swirl-stagger": `${SWIRL_STAGGER}s`,
    };
  });

  // Index of the box nearest to the pointer, -1 outside the grid
  const getPointerCellIndex = (e: MouseEvent): number => {
    const rect = heroRef.value?.getBoundingClientRect();
    if (!rect || !grid.gridMetrics.value) return -1;

    return getCellIndexAt(
      { x: e.clientX - rect.left, y: e.clientY - rect.top },
      grid.gridMetrics.value
    );
  };

  // Every move goes through here, so each finished game scores exactly once
  const setGame = (next: GomokuGame) => {
    game.value = next;
    if (next.status === "won") score.value.player++;
    if (next.status === "lost") score.value.computer++;
    if (!GAME_RESULT_KEYS[next.status]) return;

    // A draw has no line, so nothing to wait for
    const lineLength = next.winningLine.length;
    const revealDelay = lineLength
      ? getStrikeDelay(lineLength) + STRIKE_DURATION
      : 0;
    clearableTimer = setTimeout(() => {
      isClearable.value = true;
    }, revealDelay * 1000);
  };

  const playAt = (index: number) => {
    const metrics = grid.gridMetrics.value;
    if (!metrics) return;

    const current = game.value ?? createGomokuGame(metrics.cols, metrics.rows);
    const next = playerMove(current, index);
    if (next === current) return;

    if (!game.value) {
      // Read before pauseCrosses hides the crosses
      if (grid.isCrossShown(index)) isPlayingCrosses.value = true;
      grid.pauseCrosses();
    }
    grid.flashBox(index);
    setGame(next);

    if (next.status !== "computerTurn") return;
    computerMoveTimer = setTimeout(() => {
      if (game.value) setGame(computerMove(game.value));
    }, COMPUTER_MOVE_DELAY);
  };

  const handleHeroClick = (e: MouseEvent) => {
    if (finaleStart.value) return;

    const index = getPointerCellIndex(e);
    if (index === -1) return;

    if (isClearable.value) handleGameClear();
    else playAt(index);
  };

  const handleHeroPointerMove = (e: PointerEvent) => {
    hoverIndex.value = getPointerCellIndex(e);
  };

  // Reduced motion never animates the strike, so it never gets the finale
  const handleStrikeEnd = () => {
    const line = game.value?.winningLine ?? [];
    const boxes = grid.boxes.value;
    const first = boxes[line[0] ?? -1];
    const last = boxes[line.at(-1) ?? -1];
    const hero = heroRef.value?.getBoundingClientRect();
    const isFinaleWin =
      game.value?.status === "won" && score.value.player >= FINALE_WINS;
    if (!isFinaleWin || !first || !last || !hero) return;

    // Grid places, not the boxes' current rects, so the copies land exactly on them
    finaleStart.value = {
      from: boxes.map(({ x, y }) => ({ x: hero.left + x, y: hero.top + y })),
      origin: {
        x: hero.left + (first.x + last.x + HERO_BOX_SIZE) / 2,
        y: hero.top + (first.y + last.y + HERO_BOX_SIZE) / 2,
      },
    };
    isGridAway.value = true;
    grid.hold();
  };

  // The copies have landed on the grid, so the real one takes over
  const handleFinaleDone = () => {
    isGridAway.value = false;
    finaleStart.value = null;
    grid.release();
  };

  // Quit and Clear both return to the idle animation
  const handleGameClear = () => {
    clearTimeout(computerMoveTimer);
    clearTimeout(clearableTimer);
    isClearable.value = false;
    game.value = null;
    grid.resumeCrosses();

    const { computer, player } = score.value;
    if (Math.max(computer, player) >= FINALE_WINS) {
      score.value = { computer: 0, player: 0 };
      isPlayingCrosses.value = false;
    }
  };

  onUnmounted(() => {
    clearTimeout(computerMoveTimer);
    clearTimeout(clearableTimer);
  });

  return {
    finaleStart,
    game,
    isGridAway,
    isHoverPlayable,
    isScoreVisible,
    marks,
    phase,
    resultKey,
    revealStyle,
    score,
    strike,
    handleFinaleDone,
    handleGameClear,
    handleHeroClick,
    handleHeroPointerMove,
    handleStrikeEnd,
  };
};

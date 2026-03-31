/**
 * Game Logic Utilities
 *
 * Core game mechanics for Water Sort Puzzle:
 * - Pour validation (can we pour from tube A to tube B?)
 * - Pour execution (move colors between tubes)
 * - Win detection (is the puzzle solved?)
 */

// Maximum segments per tube
export const MAX_SEGMENTS = 4;

// Type for a single tube (array of color names, bottom to top)
export type Tube = string[];

// Type for game state (array of tubes)
export type GameState = Tube[];

/**
 * Get the top color of a tube (the one that would pour out)
 * Returns null if tube is empty
 */
export const getTopColor = (tube: Tube): string | null => {
  if (tube.length === 0) return null;
  return tube[tube.length - 1];
};

/**
 * Count how many of the same color are on top of a tube
 * Example: ['blue', 'red', 'red', 'red'] returns 3 (three reds on top)
 */
export const getTopColorCount = (tube: Tube): number => {
  if (tube.length === 0) return 0;

  const topColor = getTopColor(tube);
  let count = 0;

  // Count from top going down
  for (let i = tube.length - 1; i >= 0; i--) {
    if (tube[i] === topColor) {
      count++;
    } else {
      break; // Stop when we hit a different color
    }
  }

  return count;
};

/**
 * Check if we can pour from source tube to destination tube
 *
 * Rules:
 * 1. Source tube must not be empty
 * 2. Destination must have space (less than 4 segments)
 * 3. Either destination is empty OR top colors match
 * 4. Can't pour to yourself
 */
export const canPour = (
  sourceIndex: number,
  destIndex: number,
  gameState: GameState
): boolean => {
  // Can't pour to yourself
  if (sourceIndex === destIndex) return false;

  const sourceTube = gameState[sourceIndex];
  const destTube = gameState[destIndex];

  // Source must have something to pour
  if (sourceTube.length === 0) return false;

  // Destination must have space
  if (destTube.length >= MAX_SEGMENTS) return false;

  // If destination is empty, we can always pour
  if (destTube.length === 0) return true;

  // Otherwise, top colors must match
  const sourceTopColor = getTopColor(sourceTube);
  const destTopColor = getTopColor(destTube);

  return sourceTopColor === destTopColor;
};

/**
 * Execute a pour from source to destination
 * Returns the new game state (does not modify original)
 *
 * Pours as many segments of the same color as possible
 * (like real water sort - continuous pour)
 */
export const executePour = (
  sourceIndex: number,
  destIndex: number,
  gameState: GameState
): GameState => {
  // Create a deep copy of game state
  const newState: GameState = gameState.map(tube => [...tube]);

  const sourceTube = newState[sourceIndex];
  const destTube = newState[destIndex];

  // Get the color we're pouring and how many
  const pourColor = getTopColor(sourceTube);
  if (!pourColor) return newState; // Nothing to pour

  // Calculate how many we can pour
  const topColorCount = getTopColorCount(sourceTube);
  const availableSpace = MAX_SEGMENTS - destTube.length;
  const pourCount = Math.min(topColorCount, availableSpace);

  // Execute the pour
  for (let i = 0; i < pourCount; i++) {
    const color = sourceTube.pop(); // Remove from source
    if (color) {
      destTube.push(color); // Add to destination
    }
  }

  return newState;
};

/**
 * Check if a single tube is "complete" (solved)
 * A tube is complete if it's either:
 * - Empty, OR
 * - Full (4 segments) with all same color
 */
export const isTubeComplete = (tube: Tube): boolean => {
  // Empty tube is complete
  if (tube.length === 0) return true;

  // Must be full
  if (tube.length !== MAX_SEGMENTS) return false;

  // All colors must be the same
  const firstColor = tube[0];
  return tube.every(color => color === firstColor);
};

/**
 * Check if the entire puzzle is solved (win condition)
 * All tubes must be complete
 */
export const checkWin = (gameState: GameState): boolean => {
  return gameState.every(tube => isTubeComplete(tube));
};

/**
 * Check if a tube is empty
 */
export const isTubeEmpty = (tube: Tube): boolean => {
  return tube.length === 0;
};

/**
 * Get all valid moves from current state
 * Returns array of {from, to} pairs
 * Useful for hint system later
 */
export const getValidMoves = (
  gameState: GameState
): { from: number; to: number }[] => {
  const moves: { from: number; to: number }[] = [];

  for (let from = 0; from < gameState.length; from++) {
    for (let to = 0; to < gameState.length; to++) {
      if (canPour(from, to, gameState)) {
        moves.push({ from, to });
      }
    }
  }

  return moves;
};

/**
 * Check if any valid moves exist
 * If no moves and not won, player is stuck
 */
export const hasValidMoves = (gameState: GameState): boolean => {
  return getValidMoves(gameState).length > 0;
};

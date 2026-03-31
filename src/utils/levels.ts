/**
 * Level Data
 *
 * Each level is an array of tubes.
 * Each tube is an array of colors (bottom to top).
 * Empty array [] means empty tube.
 *
 * For Phase 2 testing, we create a few manual levels.
 * Later in Phase 5, we'll add procedural generation.
 */

import { GameState } from './gameLogic';

// Simple test level (very easy - for testing mechanics)
export const TEST_LEVEL: GameState = [
  ['blue', 'green', 'blue', 'green'],   // Mixed
  ['green', 'blue', 'green', 'blue'],   // Mixed
  [],                                    // Empty
  [],                                    // Empty
];

// Level 1: Easy (2 colors, 4 tubes)
export const LEVEL_1: GameState = [
  ['blue', 'blue', 'green', 'green'],
  ['green', 'green', 'blue', 'blue'],
  [],
  [],
];

// Level 2: Easy (2 colors, more mixed)
export const LEVEL_2: GameState = [
  ['blue', 'green', 'blue', 'green'],
  ['green', 'blue', 'green', 'blue'],
  [],
  [],
];

// Level 3: Medium (3 colors, 5 tubes)
export const LEVEL_3: GameState = [
  ['blue', 'green', 'yellow', 'blue'],
  ['yellow', 'blue', 'green', 'yellow'],
  ['green', 'yellow', 'blue', 'green'],
  [],
  [],
];

// Level 4: Medium (3 colors, more complex)
export const LEVEL_4: GameState = [
  ['yellow', 'blue', 'green', 'yellow'],
  ['green', 'yellow', 'blue', 'green'],
  ['blue', 'green', 'yellow', 'blue'],
  [],
  [],
];

// Level 5: Medium-Hard (4 colors, 6 tubes)
export const LEVEL_5: GameState = [
  ['blue', 'green', 'yellow', 'purple'],
  ['yellow', 'purple', 'blue', 'green'],
  ['purple', 'blue', 'green', 'yellow'],
  ['green', 'yellow', 'purple', 'blue'],
  [],
  [],
];

// All levels array (for easy access)
export const LEVELS: GameState[] = [
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
  LEVEL_4,
  LEVEL_5,
];

/**
 * Get a deep copy of a level (so we don't modify the original)
 */
export const getLevel = (levelNumber: number): GameState => {
  const levelIndex = levelNumber - 1; // Level 1 = index 0
  const level = LEVELS[levelIndex] || LEVELS[0];

  // Return a deep copy
  return level.map(tube => [...tube]);
};

/**
 * Get total number of available levels
 */
export const getTotalLevels = (): number => {
  return LEVELS.length;
};

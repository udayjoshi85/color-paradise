/**
 * Color Paradise - Color Constants
 *
 * THEME: Dark Violet (consistent across all screens)
 * Inspired by the Adlely Apps logo style
 */

// Main liquid colors - bright and playful (cartoon style)
export const LIQUID_COLORS: { [key: string]: { main: string; dark: string } } = {
  blue: {
    main: '#4FC3F7',
    dark: '#0288D1',
  },
  green: {
    main: '#81C784',
    dark: '#388E3C',
  },
  yellow: {
    main: '#FFD54F',
    dark: '#FFA000',
  },
  purple: {
    main: '#BA68C8',
    dark: '#7B1FA2',
  },
  orange: {
    main: '#FF8A65',
    dark: '#E64A19',
  },
  pink: {
    main: '#F06292',
    dark: '#C2185B',
  },
  brown: {
    main: '#A1887F',
    dark: '#5D4037',
  },
};

// Get color names as an array (useful for level generation)
export const COLOR_NAMES = Object.keys(LIQUID_COLORS);

// App theme colors - DARK VIOLET THEME (consistent with splash screen)
export const THEME = {
  // Background - Dark violet gradient
  backgroundTop: '#4A148C',       // Dark violet (top)
  backgroundBottom: '#1A0533',    // Darker violet (bottom)
  background: '#2E0854',          // Fallback solid (mid violet)

  // Splash screen
  splashBackground: '#4A148C',    // Dark violet

  // Tube colors (adjusted for dark background)
  tubeGlass: 'rgba(255, 255, 255, 0.92)',
  tubeStroke: '#9575CD',          // Light purple border
  tubeInner: 'rgba(200, 180, 240, 0.3)',

  // Text colors
  textPrimary: '#FFFFFF',         // White on dark bg
  textSecondary: '#B39DDB',       // Light purple
  textWhite: '#FFFFFF',

  // Game title colors (matching logo style - colorful bubble letters)
  titleColors: {
    pink: '#FF6B9D',
    orange: '#FFA726',
    yellow: '#FFEB3B',
    green: '#66BB6A',
    purple: '#AB47BC',
    blue: '#42A5F5',
    cyan: '#26C6DA',
  },

  // Accent colors
  accent: '#FFD700',              // Gold
  accentGlow: 'rgba(255, 215, 0, 0.4)',

  // Button colors
  success: '#4CAF50',
  buttonPrimary: '#7C4DFF',       // Bright purple
  buttonSecondary: '#5E35B1',     // Deep purple
};

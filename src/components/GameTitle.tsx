/**
 * GameTitle Component
 *
 * Displays "COLOR PARADISE" in colorful bubble letter style
 * Matches the style from Color_Paradise.jpg reference:
 * - Each letter has different bright color
 * - 3D effect with dark purple shadow/outline
 * - Glossy bubble appearance
 * - NO white dots
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Colors for each letter (matching the reference image style)
const TITLE_CONFIG = {
  // "COLOR" - top row
  color: [
    { char: 'C', color: '#FF6B9D' },   // Pink
    { char: 'O', color: '#FFA726' },   // Orange
    { char: 'L', color: '#7CB342' },   // Green
    { char: 'O', color: '#AB47BC' },   // Purple
    { char: 'R', color: '#42A5F5' },   // Blue
  ],
  // "PARADISE" - bottom row
  paradise: [
    { char: 'P', color: '#FF7043' },   // Red-orange
    { char: 'A', color: '#FFCA28' },   // Yellow
    { char: 'R', color: '#FFA726' },   // Orange
    { char: 'A', color: '#66BB6A' },   // Green
    { char: 'D', color: '#42A5F5' },   // Blue
    { char: 'I', color: '#7CB342' },   // Green
    { char: 'S', color: '#26C6DA' },   // Cyan
    { char: 'E', color: '#AB47BC' },   // Purple
  ],
};

interface LetterProps {
  char: string;
  color: string;
  size?: number;
}

// Single bubble letter with 3D effect
const BubbleLetter: React.FC<LetterProps> = ({ char, color, size = 34 }) => (
  <View style={styles.letterWrapper}>
    {/* Dark shadow layer (3D depth effect) */}
    <Text
      style={[
        styles.letterShadow,
        {
          fontSize: size,
          left: 2,
          top: 3,
        },
      ]}
    >
      {char}
    </Text>

    {/* Main colored letter with gradient-like effect */}
    <Text
      style={[
        styles.letter,
        {
          fontSize: size,
          color: color,
          textShadowColor: darkenColor(color, 0.3),
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 0,
        },
      ]}
    >
      {char}
    </Text>
  </View>
);

// Helper function to darken a color
const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * percent));
  const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * percent));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
};

const GameTitle: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* "COLOR" - top row */}
      <View style={styles.row}>
        {TITLE_CONFIG.color.map((item, index) => (
          <BubbleLetter
            key={`color-${index}`}
            char={item.char}
            color={item.color}
            size={38}
          />
        ))}
      </View>

      {/* "PARADISE" - bottom row */}
      <View style={styles.row}>
        {TITLE_CONFIG.paradise.map((item, index) => (
          <BubbleLetter
            key={`paradise-${index}`}
            char={item.char}
            color={item.color}
            size={32}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -2,
  },

  letterWrapper: {
    position: 'relative',
    marginHorizontal: -1,
  },

  letter: {
    fontWeight: '900',
    letterSpacing: -1,
  },

  // Dark purple shadow for 3D depth
  letterShadow: {
    position: 'absolute',
    fontWeight: '900',
    color: '#1A0533',
    letterSpacing: -1,
  },
});

export default GameTitle;

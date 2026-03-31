/**
 * Tube Component
 *
 * Features:
 * - Continuous liquid blocks
 * - Subtle selection highlight on liquid
 * - Lift + Move + Tilt animation when pouring
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LIQUID_COLORS, THEME } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TUBE_WIDTH = Math.min(55, SCREEN_WIDTH / 8);
const TUBE_HEIGHT = TUBE_WIDTH * 3.2;
const SEGMENT_HEIGHT = TUBE_HEIGHT / 4;
const BORDER_RADIUS = TUBE_WIDTH / 2;
const RIM_WIDTH = TUBE_WIDTH + 14;
const RIM_HEIGHT = 12;

const LIFT_AMOUNT = 12;

interface TubeProps {
  colors: string[];
  isSelected?: boolean;
  isPouringFrom?: boolean;
  moveToX?: number;  // How far to move horizontally toward target
  onPress?: () => void;
  disabled?: boolean;
}

// Helper to lighten a color
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Group consecutive same colors
const groupColors = (colors: string[]): { color: string; count: number }[] => {
  if (colors.length === 0) return [];
  const groups: { color: string; count: number }[] = [];
  let currentColor = colors[0];
  let count = 1;
  for (let i = 1; i < colors.length; i++) {
    if (colors[i] === currentColor) {
      count++;
    } else {
      groups.push({ color: currentColor, count });
      currentColor = colors[i];
      count = 1;
    }
  }
  groups.push({ color: currentColor, count });
  return groups;
};

// Liquid block with selection highlight
const LiquidBlock: React.FC<{
  colorName: string;
  segmentCount: number;
  isBottom: boolean;
  isTop: boolean;
  isSelected: boolean;
}> = ({ colorName, segmentCount, isBottom, isTop, isSelected }) => {
  const colorData = LIQUID_COLORS[colorName];
  if (!colorData) return null;

  const blockHeight = SEGMENT_HEIGHT * segmentCount;

  return (
    <View style={[
      styles.liquidBlock,
      { height: blockHeight },
      isBottom && styles.bottomBlock,
      isSelected && isTop && styles.liquidSelected,
    ]}>
      <LinearGradient
        colors={[
          lightenColor(colorData.main, 0.1),
          colorData.main,
        ]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      {isTop && <View style={styles.topShine} />}
      {isSelected && isTop && <View style={styles.selectionOutline} />}
    </View>
  );
};

const Tube: React.FC<TubeProps> = ({
  colors = [],
  isSelected = false,
  isPouringFrom = false,
  moveToX = 0,
  onPress,
  disabled = false,
}) => {
  // Animation values
  const liftAnim = useRef(new Animated.Value(0)).current;
  const moveXAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Selection animation - just lift
  useEffect(() => {
    if (isSelected && !isPouringFrom) {
      Animated.parallel([
        Animated.spring(liftAnim, {
          toValue: -LIFT_AMOUNT,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.02,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isPouringFrom) {
      Animated.parallel([
        Animated.spring(liftAnim, {
          toValue: 0,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(moveXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSelected, isPouringFrom]);

  // Pouring animation - move toward target, then tilt
  useEffect(() => {
    if (isPouringFrom && moveToX !== 0) {
      const tiltAngle = moveToX > 0 ? 50 : -50;

      Animated.sequence([
        // First: lift up more and move toward target
        Animated.parallel([
          Animated.timing(liftAnim, {
            toValue: -LIFT_AMOUNT - 20,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(moveXAnim, {
            toValue: moveToX * 0.4, // Move 40% of distance toward target
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        // Then: tilt and pour
        Animated.timing(tiltAnim, {
          toValue: tiltAngle,
          duration: 200,
          useNativeDriver: true,
        }),
        // Hold pour position
        Animated.delay(250),
        // Return to normal
        Animated.parallel([
          Animated.timing(tiltAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(moveXAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(liftAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isPouringFrom, moveToX]);

  const colorGroups = groupColors(colors);
  const totalSegments = colors.length;
  const emptySegments = 4 - totalSegments;

  const renderLiquids = () => {
    const elements: React.ReactNode[] = [];

    if (emptySegments > 0) {
      elements.push(
        <View key="empty" style={{ height: SEGMENT_HEIGHT * emptySegments }} />
      );
    }

    let segmentIndex = totalSegments;
    for (let i = colorGroups.length - 1; i >= 0; i--) {
      const group = colorGroups[i];
      segmentIndex -= group.count;

      elements.push(
        <LiquidBlock
          key={`liquid-${i}`}
          colorName={group.color}
          segmentCount={group.count}
          isBottom={segmentIndex === 0}
          isTop={i === colorGroups.length - 1}
          isSelected={isSelected}
        />
      );
    }

    return elements;
  };

  const rotation = tiltAnim.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: ['-50deg', '0deg', '50deg'],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
      style={styles.touchable}
    >
      <Animated.View
        style={[
          styles.tubeWrapper,
          {
            transform: [
              { translateX: moveXAnim },
              { translateY: liftAnim },
              { scale: scaleAnim },
              { rotate: rotation },
            ],
          },
        ]}
      >
        {/* Tube Rim */}
        <View style={[
          styles.tubeRim,
          isSelected && styles.tubeRimSelected,
        ]}>
          <View style={styles.rimShine} />
        </View>

        {/* Tube Body */}
        <View style={[
          styles.tube,
          isSelected && styles.tubeBodySelected,
        ]}>
          <View style={styles.liquidContainer}>
            {renderLiquids()}
          </View>
          <View style={styles.glassShine} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    padding: 6,
    paddingBottom: 6 + LIFT_AMOUNT + 20,
    paddingTop: 25,
    alignItems: 'center',
  },

  tubeWrapper: {
    alignItems: 'center',
  },

  tubeRim: {
    width: RIM_WIDTH,
    height: RIM_HEIGHT,
    backgroundColor: 'rgba(220, 235, 245, 0.95)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#90A4AE',
    zIndex: 2,
    overflow: 'hidden',
  },

  tubeRimSelected: {
    borderColor: '#FFD700',
  },

  rimShine: {
    position: 'absolute',
    top: 2,
    left: 5,
    width: 18,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 2,
  },

  tube: {
    width: TUBE_WIDTH,
    height: TUBE_HEIGHT,
    backgroundColor: 'rgba(230, 240, 250, 0.85)',
    borderWidth: 2,
    borderColor: '#90A4AE',
    borderTopWidth: 0,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    overflow: 'hidden',
    marginTop: -1,
  },

  tubeBodySelected: {
    borderColor: '#FFD700',
  },

  liquidContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  liquidBlock: {
    width: '100%',
    overflow: 'hidden',
  },

  bottomBlock: {
    borderBottomLeftRadius: BORDER_RADIUS - 4,
    borderBottomRightRadius: BORDER_RADIUS - 4,
  },

  liquidSelected: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.8)',
  },

  selectionOutline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
  },

  topShine: {
    position: 'absolute',
    top: 2,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },

  glassShine: {
    position: 'absolute',
    left: 3,
    top: 8,
    width: 4,
    height: TUBE_HEIGHT - 25,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
  },
});

export default Tube;

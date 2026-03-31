/**
 * LiquidStream Component
 *
 * Shows a continuous viscous liquid flowing from source tube to destination tube
 * Follows physics - liquid flows from tilted tube rim to target tube opening
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { LIQUID_COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LiquidStreamProps {
  visible: boolean;
  color: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  onComplete?: () => void;
}

const LiquidStream: React.FC<LiquidStreamProps> = ({
  visible,
  color,
  fromX,
  fromY,
  toX,
  toY,
  onComplete,
}) => {
  const flowProgress = useRef(new Animated.Value(0)).current;
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<any>(null);

  const colorData = LIQUID_COLORS[color];
  const liquidColor = colorData?.main || '#4FC3F7';
  const liquidColorLight = colorData?.main ? lightenColor(colorData.main, 0.15) : '#81D4FA';
  const liquidColorDark = colorData?.dark || '#0288D1';

  useEffect(() => {
    if (visible) {
      flowProgress.setValue(0);

      // Animate the liquid flow
      Animated.timing(flowProgress, {
        toValue: 1,
        duration: 450,
        useNativeDriver: false,
      }).start(() => {
        // Small delay before completing
        setTimeout(() => {
          onComplete?.();
        }, 50);
      });
    }
  }, [visible]);

  if (!visible) return null;

  // Calculate a natural flowing curve
  // The liquid should flow from the tilted tube rim downward
  const isLeftToRight = toX > fromX;

  // Offset the start point to come from the rim of tilted tube
  const rimOffsetX = isLeftToRight ? 15 : -15;
  const actualFromX = fromX + rimOffsetX;
  const actualFromY = fromY - 30; // Above the tube rim

  // Control points for a natural gravity-following curve
  // The liquid should arc slightly then fall into the target
  const controlX1 = actualFromX + (toX - actualFromX) * 0.3;
  const controlY1 = actualFromY - 10; // Slight rise as it leaves tube

  const controlX2 = actualFromX + (toX - actualFromX) * 0.7;
  const controlY2 = toY - 20; // Falls toward target

  // End point - into the target tube opening
  const actualToY = toY + 10;

  // Create a cubic bezier path for natural flow
  const pathD = `M ${actualFromX} ${actualFromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${actualToY}`;

  // Animate dasharray to show flowing liquid
  const dashOffset = flowProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const streamOpacity = flowProgress.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 1, 1, 0.8],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={{ opacity: streamOpacity }}>
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          style={styles.svg}
        >
          <Defs>
            <SvgGradient id="liquidFlowGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={liquidColorLight} stopOpacity="0.9" />
              <Stop offset="0.5" stopColor={liquidColor} stopOpacity="1" />
              <Stop offset="1" stopColor={liquidColorDark} stopOpacity="1" />
            </SvgGradient>
          </Defs>

          {/* Main liquid stream - thick viscous flow */}
          <AnimatedPath
            d={pathD}
            stroke="url(#liquidFlowGrad)"
            strokeWidth={16}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="300"
            strokeDashoffset={dashOffset}
          />

          {/* Inner highlight for glossy effect */}
          <AnimatedPath
            d={pathD}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="300"
            strokeDashoffset={dashOffset}
          />

          {/* Edge shadow for depth */}
          <AnimatedPath
            d={pathD}
            stroke={liquidColorDark}
            strokeWidth={18}
            strokeLinecap="round"
            fill="none"
            opacity={0.3}
            strokeDasharray="300"
            strokeDashoffset={dashOffset}
          />
        </Svg>
      </Animated.View>

      {/* Splash effect at destination */}
      <SplashEffect
        visible={visible}
        x={toX}
        y={actualToY}
        color={liquidColor}
      />
    </View>
  );
};

// Animated SVG Path component
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Helper to lighten a color
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * percent));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Splash ripple effect when liquid enters target tube
const SplashEffect: React.FC<{
  visible: boolean;
  x: number;
  y: number;
  color: string;
}> = ({ visible, x, y, color }) => {
  const scale1 = useRef(new Animated.Value(0)).current;
  const scale2 = useRef(new Animated.Value(0)).current;
  const opacity1 = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset
      scale1.setValue(0);
      scale2.setValue(0);
      opacity1.setValue(0);
      opacity2.setValue(0);

      // Delay splash until liquid reaches destination
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          // First ripple
          Animated.sequence([
            Animated.parallel([
              Animated.timing(scale1, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(opacity1, {
                toValue: 0.6,
                duration: 100,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(opacity1, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          // Second ripple (delayed)
          Animated.sequence([
            Animated.delay(80),
            Animated.parallel([
              Animated.timing(scale2, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(opacity2, {
                toValue: 0.4,
                duration: 100,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(opacity2, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    }
  }, [visible]);

  return (
    <>
      <Animated.View
        style={[
          styles.splash,
          {
            left: x - 12,
            top: y - 6,
            backgroundColor: color,
            opacity: opacity1,
            transform: [{ scale: scale1 }, { scaleY: 0.5 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.splash,
          {
            left: x - 8,
            top: y - 4,
            width: 16,
            height: 16,
            backgroundColor: color,
            opacity: opacity2,
            transform: [{ scale: scale2 }, { scaleY: 0.5 }],
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50, // Below tubes but above background
  },

  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  splash: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default LiquidStream;

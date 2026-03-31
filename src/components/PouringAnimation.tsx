/**
 * PouringAnimation Component
 *
 * Shows liquid flowing from source tube to destination tube
 * Creates a curved arc of liquid drops/stream
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LIQUID_COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PouringAnimationProps {
  visible: boolean;
  color: string;
  sourcePosition: { x: number; y: number };
  destPosition: { x: number; y: number };
  onComplete: () => void;
}

// Individual liquid drop
const LiquidDrop: React.FC<{
  color: string;
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  size: number;
}> = ({ color, delay, startX, startY, endX, endY, size }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const colorData = LIQUID_COLORS[color];
  const dropColor = colorData?.main || '#4FC3F7';

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate arc path
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, endX],
  });

  // Arc motion (parabola)
  const midY = Math.min(startY, endY) - 60; // Peak of arc
  const translateY = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [startY, midY, endY],
  });

  // Scale up then down
  const scale = progress.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0.5, 1.2, 1, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.drop,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dropColor,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
        },
      ]}
    />
  );
};

const PouringAnimation: React.FC<PouringAnimationProps> = ({
  visible,
  color,
  sourcePosition,
  destPosition,
  onComplete,
}) => {
  useEffect(() => {
    if (visible) {
      // Animation duration
      const timer = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  // Create multiple drops for stream effect
  const drops = [];
  const dropCount = 5;

  for (let i = 0; i < dropCount; i++) {
    drops.push(
      <LiquidDrop
        key={i}
        color={color}
        delay={i * 40}
        startX={sourcePosition.x}
        startY={sourcePosition.y}
        endX={destPosition.x}
        endY={destPosition.y}
        size={12 + (i % 2) * 4}
      />
    );
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {drops}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },

  drop: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default PouringAnimation;

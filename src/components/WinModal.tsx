/**
 * WinModal - Level Complete Celebration Screen
 *
 * Features:
 * - Colorful animated background
 * - Stars animation
 * - Confetti-like effects
 * - "Play Again" and "Next Level" buttons
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WinModalProps {
  visible: boolean;
  level: number;
  moves: number;
  onPlayAgain: () => void;
  onNextLevel: () => void;
}

// Animated star component
const AnimatedStar: React.FC<{
  delay: number;
  left: number;
  size: number;
  color: string;
}> = ({ delay, left, size, color }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT + 50,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 2400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.2,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.8,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(translateY, {
          toValue: -50,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Text
      style={[
        styles.star,
        {
          left: `${left}%`,
          fontSize: size,
          color,
          opacity,
          transform: [
            { translateY },
            { rotate: spin },
            { scale },
          ],
        },
      ]}
    >
      ✦
    </Animated.Text>
  );
};

const WinModal: React.FC<WinModalProps> = ({
  visible,
  level,
  moves,
  onPlayAgain,
  onNextLevel,
}) => {
  // Trophy animation
  const trophyScale = useRef(new Animated.Value(0)).current;
  const trophyRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      trophyScale.setValue(0);
      trophyRotate.setValue(0);
      textOpacity.setValue(0);
      buttonsSlide.setValue(50);

      // Trophy bounce in
      Animated.sequence([
        Animated.spring(trophyScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        // Wiggle
        Animated.sequence([
          Animated.timing(trophyRotate, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(trophyRotate, {
            toValue: -0.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(trophyRotate, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Text fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }).start();

      // Buttons slide up
      Animated.spring(buttonsSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const trophySpin = trophyRotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  // Star colors for confetti effect
  const starColors = ['#FFD700', '#FF6B9D', '#4FC3F7', '#81C784', '#BA68C8', '#FF8A65'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        {/* Colorful gradient background */}
        <LinearGradient
          colors={['rgba(74, 20, 140, 0.95)', 'rgba(26, 5, 51, 0.98)']}
          style={styles.gradientBg}
        />

        {/* Animated stars/confetti */}
        {starColors.map((color, index) => (
          <AnimatedStar
            key={`star1-${index}`}
            delay={index * 200}
            left={10 + index * 15}
            size={20 + (index % 3) * 8}
            color={color}
          />
        ))}
        {starColors.map((color, index) => (
          <AnimatedStar
            key={`star2-${index}`}
            delay={100 + index * 200}
            left={5 + index * 16}
            size={16 + (index % 3) * 6}
            color={starColors[(index + 3) % 6]}
          />
        ))}

        {/* Content */}
        <View style={styles.content}>
          {/* Trophy */}
          <Animated.Text
            style={[
              styles.trophy,
              {
                transform: [
                  { scale: trophyScale },
                  { rotate: trophySpin },
                ],
              },
            ]}
          >
            🏆
          </Animated.Text>

          {/* Level Complete Text */}
          <Animated.View style={{ opacity: textOpacity }}>
            <Text style={styles.title}>Level Complete!</Text>
            <Text style={styles.subtitle}>Level {level}</Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{moves}</Text>
                <Text style={styles.statLabel}>Moves</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>⭐</Text>
                <Text style={styles.statLabel}>Perfect!</Text>
              </View>
            </View>
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={[
              styles.buttonsContainer,
              { transform: [{ translateY: buttonsSlide }] },
            ]}
          >
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={onPlayAgain}
            >
              <Text style={styles.buttonSecondaryText}>🔄 Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={onNextLevel}
            >
              <LinearGradient
                colors={['#7C4DFF', '#536DFE']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonPrimaryText}>Next Level ➜</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  star: {
    position: 'absolute',
    top: 0,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  trophy: {
    fontSize: 80,
    marginBottom: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },

  statsContainer: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 20,
  },

  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  statLabel: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginTop: 4,
  },

  buttonsContainer: {
    marginTop: 35,
    width: '100%',
    gap: 12,
  },

  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  buttonSecondaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  buttonPrimary: {
    borderRadius: 30,
    overflow: 'hidden',
  },

  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },

  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default WinModal;

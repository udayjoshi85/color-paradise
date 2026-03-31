/**
 * SplashScreen - Animated splash screen
 *
 * Shows "Adlely Apps" with drop animation on dark violet background
 * Text styled like the logo (orange/yellow with purple outline)
 * NO pink background - just the text styling
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Letter configuration for "Adlely" - matching logo colors (orange/yellow)
const ADLELY_LETTERS = [
  { char: 'A', color: '#FFB74D' },
  { char: 'd', color: '#FFA726' },
  { char: 'l', color: '#FFB74D' },
  { char: 'e', color: '#FFA726' },
  { char: 'l', color: '#FFB74D' },
  { char: 'y', color: '#FFA726' },
];

// Letter configuration for "Apps"
const APPS_LETTERS = [
  { char: 'A', color: '#FFA726' },
  { char: 'p', color: '#FFB74D' },
  { char: 'p', color: '#FFA726' },
  { char: 's', color: '#FFB74D' },
];

interface AnimatedLetterProps {
  char: string;
  color: string;
  delay: number;
  size: number;
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({ char, color, delay, size }) => {
  const dropAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Drop animation with bounce
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        // Drop down
        Animated.spring(dropAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        // Fade in
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      // Small bounce effect
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.letterContainer,
        {
          transform: [
            { translateY: dropAnim },
            { scale: bounceAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Dark purple shadow (3D effect) */}
      <Text style={[styles.letterShadow, { fontSize: size }]}>{char}</Text>
      {/* Main orange/yellow letter */}
      <Text style={[styles.letter, { fontSize: size, color }]}>{char}</Text>
    </Animated.View>
  );
};

const SplashScreen: React.FC = () => {
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in "A Game Studio" after letters drop
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Dark Violet Gradient Background */}
      <LinearGradient
        colors={[THEME.backgroundTop, THEME.backgroundBottom]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Decorative stars (subtle) */}
      <View style={styles.stars}>
        <Text style={[styles.star, { top: '15%', left: '20%' }]}>✦</Text>
        <Text style={[styles.star, { top: '25%', right: '15%' }]}>✦</Text>
        <Text style={[styles.star, { bottom: '30%', left: '10%' }]}>✦</Text>
        <Text style={[styles.star, { bottom: '20%', right: '20%' }]}>✦</Text>
      </View>

      {/* Logo Text */}
      <View style={styles.logoContainer}>
        {/* "Adlely" with drop animation */}
        <View style={styles.row}>
          {ADLELY_LETTERS.map((item, index) => (
            <AnimatedLetter
              key={`adlely-${index}`}
              char={item.char}
              color={item.color}
              delay={index * 80}
              size={52}
            />
          ))}
        </View>

        {/* "Apps" with drop animation */}
        <View style={styles.row}>
          {APPS_LETTERS.map((item, index) => (
            <AnimatedLetter
              key={`apps-${index}`}
              char={item.char}
              color={item.color}
              delay={500 + index * 80}
              size={42}
            />
          ))}
        </View>
      </View>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        A Game Studio
      </Animated.Text>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, { marginHorizontal: 8 }]} />
        <View style={styles.loadingDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  star: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255, 215, 0, 0.4)',
  },

  logoContainer: {
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -4,
  },

  letterContainer: {
    position: 'relative',
    marginHorizontal: -2,
  },

  letter: {
    fontWeight: '900',
  },

  // Dark purple shadow for 3D effect (like the logo)
  letterShadow: {
    position: 'absolute',
    fontWeight: '900',
    color: '#1A0533',
    left: 2,
    top: 3,
  },

  subtitle: {
    marginTop: 20,
    fontSize: 16,
    color: THEME.textSecondary,
    fontWeight: '500',
    letterSpacing: 2,
  },

  loadingContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80,
  },

  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
  },
});

export default SplashScreen;

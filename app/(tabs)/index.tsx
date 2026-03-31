/**
 * Main App Entry Point
 *
 * Shows splash screen first, then transitions to game.
 * This gives a smooth, branded loading experience.
 */

import React, { useState, useEffect } from 'react';
import GameScreen from '../../src/screens/GameScreen';
import SplashScreen from '../../src/screens/SplashScreen';

export default function HomeScreen() {
  // Track whether app is still loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds, then show game
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  // Show game after loading
  return <GameScreen />;
}

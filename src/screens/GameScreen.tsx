/**
 * GameScreen - Main game screen with proper animations
 *
 * Features:
 * - Tube tilt animation when pouring
 * - Smooth liquid stream arc animation
 * - Proper tube position tracking
 */

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Tube from '../components/Tube';
import GameTitle from '../components/GameTitle';
import WinModal from '../components/WinModal';
import LiquidStream from '../components/LiquidStream';
import { THEME } from '../constants/colors';
import {
  GameState,
  canPour,
  executePour,
  checkWin,
  hasValidMoves,
  getTopColor,
} from '../utils/gameLogic';
import { getLevel, getTotalLevels } from '../utils/levels';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TubePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GameScreen: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [gameState, setGameState] = useState<GameState>(() => getLevel(1));
  const [selectedTube, setSelectedTube] = useState<number>(-1);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<GameState[]>([]);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);

  // Pouring animation state
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [pourFromIndex, setPourFromIndex] = useState<number>(-1);
  const [pourToIndex, setPourToIndex] = useState<number>(-1);
  const [pouringColor, setPouringColor] = useState<string>('');
  const [showStream, setShowStream] = useState<boolean>(false);

  // Track tube positions for animation
  const [tubePositions, setTubePositions] = useState<TubePosition[]>([]);
  const containerRef = useRef<View>(null);
  const [containerLayout, setContainerLayout] = useState({ x: 0, y: 0 });

  const resetLevel = useCallback(() => {
    setGameState(getLevel(currentLevel));
    setSelectedTube(-1);
    setMoveCount(0);
    setMoveHistory([]);
    setShowWinModal(false);
    setIsPouring(false);
    setShowStream(false);
  }, [currentLevel]);

  const loadNextLevel = useCallback(() => {
    const nextLevel = currentLevel < getTotalLevels() ? currentLevel + 1 : 1;
    setCurrentLevel(nextLevel);
    setGameState(getLevel(nextLevel));
    setSelectedTube(-1);
    setMoveCount(0);
    setMoveHistory([]);
    setShowWinModal(false);
    setIsPouring(false);
    setShowStream(false);
  }, [currentLevel]);

  const handlePlayAgain = useCallback(() => {
    setShowWinModal(false);
    setTimeout(() => resetLevel(), 200);
  }, [resetLevel]);

  const handleNextLevel = useCallback(() => {
    setShowWinModal(false);
    setTimeout(() => loadNextLevel(), 200);
  }, [loadNextLevel]);

  // Handle tube layout to track positions
  const handleTubeLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setTubePositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = { x, y, width, height };
      return newPositions;
    });
  }, []);

  // Handle container layout
  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setContainerLayout({ x: pageX, y: pageY });
    });
  }, []);

  // Execute pour with animation
  const executePourWithAnimation = useCallback((
    fromIndex: number,
    toIndex: number,
    currentState: GameState
  ) => {
    const topColor = getTopColor(currentState[fromIndex]);
    if (!topColor) return;

    // Set up animation state
    setIsPouring(true);
    setPourFromIndex(fromIndex);
    setPourToIndex(toIndex);
    setPouringColor(topColor);
    setMoveHistory(prev => [...prev, currentState]);

    // Start tube tilt animation, then show stream
    setTimeout(() => {
      setShowStream(true);
    }, 150);

  }, []);

  // Called when stream animation completes
  const handleStreamComplete = useCallback(() => {
    setShowStream(false);

    // Update game state
    const newState = executePour(pourFromIndex, pourToIndex, gameState);
    setGameState(newState);
    setMoveCount(prev => prev + 1);
    setSelectedTube(-1);
    setIsPouring(false);
    setPourFromIndex(-1);
    setPourToIndex(-1);

    // Check for win
    if (checkWin(newState)) {
      setTimeout(() => setShowWinModal(true), 300);
    } else if (!hasValidMoves(newState)) {
      setTimeout(() => {
        Alert.alert(
          '😅 Stuck!',
          'No more valid moves. Try again?',
          [{ text: 'Restart', onPress: resetLevel }]
        );
      }, 300);
    }
  }, [pourFromIndex, pourToIndex, gameState, resetLevel]);

  const handleTubePress = useCallback((index: number) => {
    if (isPouring) return;

    if (selectedTube === -1) {
      if (gameState[index].length > 0) {
        setSelectedTube(index);
      }
      return;
    }

    if (selectedTube === index) {
      setSelectedTube(-1);
      return;
    }

    if (canPour(selectedTube, index, gameState)) {
      executePourWithAnimation(selectedTube, index, gameState);
    } else {
      if (gameState[index].length > 0) {
        setSelectedTube(index);
      } else {
        setSelectedTube(-1);
      }
    }
  }, [selectedTube, gameState, isPouring, executePourWithAnimation]);

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || isPouring) return;

    const previousState = moveHistory[moveHistory.length - 1];
    setGameState(previousState);
    setMoveHistory(prev => prev.slice(0, -1));
    setMoveCount(prev => Math.max(0, prev - 1));
    setSelectedTube(-1);
  }, [moveHistory, isPouring]);

  // Calculate stream positions
  const getStreamPositions = () => {
    if (pourFromIndex === -1 || pourToIndex === -1) {
      return { fromX: 0, fromY: 0, toX: 0, toY: 0 };
    }

    const fromPos = tubePositions[pourFromIndex];
    const toPos = tubePositions[pourToIndex];

    if (!fromPos || !toPos) {
      return { fromX: 0, fromY: 0, toX: 0, toY: 0 };
    }

    // Calculate center top of tubes
    const fromX = containerLayout.x + fromPos.x + fromPos.width / 2;
    const fromY = containerLayout.y + fromPos.y;
    const toX = containerLayout.x + toPos.x + toPos.width / 2;
    const toY = containerLayout.y + toPos.y + 20; // Slightly into the tube

    return { fromX, fromY, toX, toY };
  };

  // Determine tilt direction
  const getTiltDirection = (fromIdx: number, toIdx: number): 'left' | 'right' | null => {
    if (fromIdx === -1 || toIdx === -1) return null;
    const fromPos = tubePositions[fromIdx];
    const toPos = tubePositions[toIdx];
    if (!fromPos || !toPos) return null;
    return toPos.x > fromPos.x ? 'right' : 'left';
  };

  // Calculate horizontal distance to move toward target
  const getMoveToX = (fromIdx: number, toIdx: number): number => {
    if (fromIdx === -1 || toIdx === -1) return 0;
    const fromPos = tubePositions[fromIdx];
    const toPos = tubePositions[toIdx];
    if (!fromPos || !toPos) return 0;
    // Return the distance (positive = move right, negative = move left)
    return toPos.x - fromPos.x;
  };

  const streamPos = getStreamPositions();
  const tiltDir = getTiltDirection(pourFromIndex, pourToIndex);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={[THEME.backgroundTop, THEME.backgroundBottom]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <GameTitle />

          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoLabel}>Level</Text>
              <Text style={styles.infoValue}>{currentLevel}</Text>
            </View>

            <View style={styles.infoBadge}>
              <Text style={styles.infoLabel}>Moves</Text>
              <Text style={styles.infoValue}>{moveCount}</Text>
            </View>
          </View>
        </View>

        <View
          ref={containerRef}
          style={styles.tubesArea}
          onLayout={handleContainerLayout}
        >
          <View style={styles.tubesRow}>
            {gameState.map((tubeColors, index) => (
              <View
                key={index}
                onLayout={(e) => handleTubeLayout(index, e)}
              >
                <Tube
                  colors={tubeColors}
                  isSelected={selectedTube === index}
                  isPouringFrom={pourFromIndex === index}
                  moveToX={pourFromIndex === index ? getMoveToX(pourFromIndex, pourToIndex) : 0}
                  onPress={() => handleTubePress(index)}
                  disabled={isPouring}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              (moveHistory.length === 0 || isPouring) && styles.controlButtonDisabled,
            ]}
            onPress={handleUndo}
            disabled={moveHistory.length === 0 || isPouring}
          >
            <Text style={styles.controlButtonText}>↩ Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, isPouring && styles.controlButtonDisabled]}
            onPress={resetLevel}
            disabled={isPouring}
          >
            <Text style={styles.controlButtonText}>🔄 Restart</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hintText}>
          {isPouring
            ? 'Pouring...'
            : selectedTube === -1
              ? 'Tap a tube to select it'
              : 'Tap another tube to pour'}
        </Text>
      </SafeAreaView>

      {/* Liquid stream animation */}
      <LiquidStream
        visible={showStream}
        color={pouringColor}
        fromX={streamPos.fromX}
        fromY={streamPos.fromY}
        toX={streamPos.toX}
        toY={streamPos.toY}
        onComplete={handleStreamComplete}
      />

      <WinModal
        visible={showWinModal}
        level={currentLevel}
        moves={moveCount}
        onPlayAgain={handlePlayAgain}
        onNextLevel={handleNextLevel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },

  header: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },

  infoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    minWidth: 80,
  },

  infoLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '500',
  },

  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textPrimary,
  },

  tubesArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  tubesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 6,
    maxWidth: SCREEN_WIDTH - 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 15,
  },

  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  controlButtonDisabled: {
    opacity: 0.4,
  },

  controlButtonText: {
    color: THEME.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  hintText: {
    textAlign: 'center',
    color: THEME.textSecondary,
    fontSize: 14,
    paddingBottom: 20,
  },
});

export default GameScreen;

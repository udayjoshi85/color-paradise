/**
 * Tab Layout
 *
 * For our game, we hide the tab bar to get a full-screen experience.
 * Later we might add navigation between screens (home, levels, game).
 */

import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,        // Hide the header
        tabBarStyle: { display: 'none' }, // Hide the tab bar
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
        }}
      />
    </Tabs>
  );
}

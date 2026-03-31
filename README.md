# Color Paradise

A fun Water Sort Puzzle game built with React Native and Expo.

**Developed by:** Adlely Apps

---

## How to Run

### Prerequisites
- Node.js installed on your computer
- Expo Go app installed on your Android phone

### Start the Development Server

1. Open a terminal in the project folder
2. Run:
   ```bash
   npm start
   ```
3. Scan the QR code with the Expo Go app on your phone

---

## Project Structure

```
color-paradise/
├── app/                    # Expo Router pages
│   └── (tabs)/
│       └── index.tsx       # Main entry point
│
├── src/                    # Our game code
│   ├── components/         # Reusable UI components
│   │   └── Tube.tsx        # The tube component
│   │
│   ├── screens/            # Full screen views
│   │   └── GameScreen.tsx  # Main game screen
│   │
│   ├── constants/          # App constants
│   │   └── colors.ts       # Color definitions
│   │
│   ├── utils/              # Helper functions
│   │
│   └── hooks/              # Custom React hooks
│
├── assets/                 # Images, fonts, etc.
│
└── app.json                # Expo configuration
```

---

## Development Phases

- [x] Phase 1: Basic Setup - Tube component and display
- [ ] Phase 2: Core Game Logic - Pouring and win detection
- [ ] Phase 3: Visual Polish - Animations and styling
- [ ] Phase 4: Game Controls - Undo, hints, restart
- [ ] Phase 5: Level System - 20 levels with progression
- [ ] Phase 6: UI/UX Polish - Final touches
- [ ] Phase 7: Production Ready - App store preparation

---

## Game Rules

1. Tap a tube to select it
2. Tap another tube to pour liquid
3. You can only pour if:
   - The top colors match, OR
   - The destination tube is empty
   - AND there's space in the destination
4. Win when each tube has only one color (or is empty)

---

## Colors Available

- Blue
- Green
- Yellow
- Purple
- Orange
- Pink
- Brown

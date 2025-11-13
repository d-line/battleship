# Battleship 1v1 – React Take-Home

Competitive 1v1 Battleship implementation focused on **gameplay UX**, **rules engine**, and **clean architecture**.  
UI is a local React SPA; game logic is encapsulated in a reusable engine class, with a simple AI opponent for offline play.

---

## Tech Stack

- **React** (TypeScript, functional components)
- **Vite** as the dev/build tool
- **Tailwind CSS** for styling
- Local, in-memory rules engine (`LocalEngine`) that can be swapped for a remote API later

---

## Prerequisites

Make sure the following are installed:

- **Node.js** >= 18
- **npm** (comes with Node) or **pnpm**/**yarn** if you prefer

Verify:

```bash
node -v
npm -v
```

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:d-line/battleship.git battleship-1v1
cd battleship-1v1
```

### 2. Install dependencies

```bash
npm install
```

or, if you use pnpm:

```bash
npm install
```

### 3. Run the app locally (dev mode)

```bash
npm run dev
```

You’ll see output similar to:

```
VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Open the printed URL in your browser (usually http://localhost:5173).


## How to Play

1.	Fleet placement
  *	On the left, you have a Fleet panel with all ships.
  * Drag a ship onto your board (middle panel).
  * Use the Rotate button (top-right) to toggle between horizontal/vertical placement.
  * Each ship can be placed exactly once; overlapping or out-of-bounds placements are rejected.

2.	Ready up
  * Once all ships are placed, click “I’m Ready”.
  * The AI opponent’s fleet is auto-placed off-screen.

3.	Firing
  * Use the Opponent Board (right panel) to fire shots.
  * Click a cell to fire:
  * Red square – hit/sink
  * Ring – miss
  * You cannot fire twice at the same cell; turn-based rules are enforced.

4. Incoming fire
  * Your board shows:
	  * Your ships
	  * AI’s hits/misses on your grid (same visual markers as your shots).

5. End of game
  * When all ships for one side are sunk, a winner banner is displayed.
  * Use Reset to start a new game.


## Project Structure

High level layout:

```
src/
  ai/
    ai.ts                  # AI ship placement + shot selection
  components/
    Board.tsx              # Board grid; place/attack modes
    ShipPalette.tsx        # Fleet panel + legend
    StatusRibbon.tsx       # Status banner (phase/turn/winner)
  engine/
    constants.ts           # Board and ship definitions
    types.ts               # Domain types (Coord, Ship, Shot, GameStatus, etc.)
    localEngine.ts         # In-memory rules engine implementation
  App.tsx                  # Main UI composition and orchestration
  main.tsx                 # React entry point
  index.css                # Tailwind CSS entry
```

Key points:

  * UI talks to the engine via a small useEngine hook.
  * Engine is authoritative for rules and state transitions (place, ready, fire, reset).
  * A future multi-player backend can implement the same interface as LocalEngine and reuse the UI as-is.


Common npm scripts:

```
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build locally
```

### Notes for Interviewers

* The focus of this implementation is:
  * Rules engine design and encapsulation
  * React component structure and UX for placement + turn-based firing
  * Clear API surface that can be swapped to a remote engine (WebSocket/HTTP)
* Current implementation runs as a local single-player vs AI demo; a server-backed RemoteEngine would be a straightforward next step using the existing engine interface.
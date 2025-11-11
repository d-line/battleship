import React, { useState } from "react";
import { Board } from './components/Board'
import { Legend, ShipPalette, type ShipSpec } from './components/ShipPalette';
import type { Orientation, PlacedShip } from './engine/types'
import { SHIP_SET } from "./engine/constant";

// test ships
const ships: PlacedShip[] = [
  {
    key: 'ship-1',
    bow: { r: 0, c: 0 },
    orientation: 'H',
    coords: [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
    hits: new Set<string>(),
  },
  {
    key: 'ship-2',
    bow: { r: 2, c: 3 },
    orientation: 'V',
    coords: [{ r: 2, c: 3 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 5, c: 3 }],
    hits: new Set<string>(),
  },
  {
    key: 'ship-3',
    bow: { r: 5, c: 5 },
    orientation: 'H',
    coords: [{ r: 5, c: 5 }, { r: 5, c: 6 }],
    hits: new Set<string>(),
  }
];

export default function App() {
  const [dragShip, setDragShip] = useState<ShipSpec | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("H");

  const SHIP_SPEC: ShipSpec[] = SHIP_SET.map((s) => ({ id: s.id, name: s.name, length: s.length }));
  console.log({dragShip})
  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>
      <div className="max-w-6xl mx-auto p-4">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Battleship — 1v1</h1>
          <div className="flex gap-2">
            {/* <button onClick={reset} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">Reset</button> */}
            <button onClick={() => setOrientation((o) => (o === "H" ? "V" : "H"))} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">Rotate: {orientation}</button>
            {/* <button disabled={!allPlaced} onClick={readyUp} className={`px-3 py-2 rounded-xl ${allPlaced ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-300 text-slate-500"}`}>I'm Ready</button> */}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-1">
            <ShipPalette ships={SHIP_SPEC} placed={[]} dragShip={dragShip} setDragShip={setDragShip} orientation={orientation} />
            <Legend />
          </div>

          <div className="md:col-span-1">
            <h2 className="font-semibold mb-2">Your Board</h2>
            <Board size={10} mode='place' ships={ships} />
          </div>

          <div className="md:col-span-1">
            <h2 className="font-semibold mb-2">Opponent Board</h2>
            <Board size={10} mode='attack' ships={ships} />
          </div>
        </div>

        <footer className="mt-10 text-xs text-slate-500">
          <p>Drag a ship from the left palette onto your board. Use Rotate to switch orientation. Ready up to start.</p>
        </footer>
      </div>
    </div>
  )
}

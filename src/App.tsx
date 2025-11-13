/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Board } from './components/Board'
import { Legend, ShipPalette, type ShipSpec } from './components/ShipPalette';
import type { Orientation, PlayerId } from './engine/types'
import { SHIP_SET } from "./engine/constant";
import { LocalEngine } from "./engine/localEngine";

function useEngine() {
  const [ engine ] = useState(() => new LocalEngine()) 
  const [, setTick] = useState(0);
  const force = () => setTick(t => t + 1);
  return {engine, force};
}

export default function App() {
  const { engine, force } = useEngine();
  const [me] = useState<PlayerId>("P1");

  const [dragShip, setDragShip] = useState<ShipSpec | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("H");

  const status = engine.getStatus();
  const canPlay = status.phase === "playing" && status.turn === me;
  const disabled = !canPlay;

  const myBoard = engine.getPrivateBoard(me);
  const oppBoard = engine.getPublicBoard(me);

  const SHIP_SPEC: ShipSpec[] = SHIP_SET.map((s) => ({ id: s.id, name: s.name, length: s.length }));

  const allPlaced = myBoard.ships.length === SHIP_SET.length;

  const onCellDrop = (r: number, c: number) => {
    if (!dragShip) return;
    const res = (engine as any).placeShip(me, dragShip.id, { r, c }, orientation);
    if (!res.ok) alert(`Cannot place: ${res.reason}`);
    setDragShip(null);
    force();
  };

  const onShoot = (r: number, c: number) => {
    const res = (engine as any).fire(me, { r, c });
    if (!res.ok && res.reason !== "Duplicate shot") alert(res.reason);
    force();
  };

  const reset = () => { (engine as any).reset(); force(); };
  const readyUp = () => { (engine as any).ready(me); force(); };

  return (
    <div className='min-h-screen w-full bg-slate-50 text-slate-900'>
      <div className="max-w-6xl mx-auto p-4">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Battleship — 1v1</h1>
          <div className="flex gap-2">
            <button onClick={reset} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">Reset</button>
            <button onClick={() => setOrientation((o) => (o === "H" ? "V" : "H"))} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">Rotate: {orientation}</button>
            <button disabled={!allPlaced} onClick={readyUp} className={`px-3 py-2 rounded-xl ${allPlaced ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-300 text-slate-500"}`}>I'm Ready</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-1">
            <ShipPalette ships={SHIP_SPEC} placed={[]} dragShip={dragShip} setDragShip={setDragShip} orientation={orientation} />
            <Legend />
          </div>

          <div className="md:col-span-1">
            <h2 className="font-semibold mb-2">Your Board</h2>
            <Board size={10} mode='place' ships={myBoard.ships} onDropCell={onCellDrop} preview={dragShip ? { kind: dragShip.id, length: dragShip.length, orientation } : null} />
          </div>

          <div className="md:col-span-1">
            <h2 className="font-semibold mb-2">Opponent Board</h2>
            <Board size={10} mode='attack' onShootCell={onShoot} shots={oppBoard.shots} disabled={disabled} />
          </div>
        </div>

        <footer className="mt-10 text-xs text-slate-500">
          <p>Drag a ship from the left palette onto your board. Use Rotate to switch orientation. Ready up to start.</p>
        </footer>
      </div>
    </div>
  )
}

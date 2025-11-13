/* eslint-disable @typescript-eslint/no-explicit-any */
import { BOARD, SHIP_SET } from "../engine/constant";
import type { Coord, IGameEngine, Orientation, PlayerId, PublicBoardView } from "../engine/types";

function randomInt(n: number) { return Math.floor(Math.random() * n); }

export function randomPlacement(engine: IGameEngine, me: PlayerId) {
  for (const kind of SHIP_SET.map((k) => k.id)) {
    let placed = false; let guard = 0;
    while (!placed && guard++ < 500) {
      const orient: Orientation = Math.random() < 0.5 ? "H" : "V";
      const spec = SHIP_SET.find((k) => k.id === kind)!;
      const maxR = orient === "H" ? BOARD.size : BOARD.size - spec.length + 0;
      const maxC = orient === "V" ? BOARD.size : BOARD.size - spec.length + 0;
      const bow: Coord = { r: randomInt(maxR), c: randomInt(maxC) };
      const res = engine.placeShip(me, kind as any, bow, orient);
      placed = (res as any).ok;
    }
  }
  engine.ready(me);
}

export function aiChooseShot(view: PublicBoardView): Coord {
  const tried = new Set(view.shots.map((s) => `${s.at.r},${s.at.c}`));
  while (true) {
    const at: Coord = { r: randomInt(BOARD.size), c: randomInt(BOARD.size) };
    const k = `${at.r},${at.c}`;
    if (!tried.has(k)) return at;
  }
}
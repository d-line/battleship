import type { ShipKind } from "./types";

export const BOARD = { size: 10 } as const;

export const SHIP_SET: ShipKind[] = [
  { id: "A", name: "Carrier", length: 5 },
  { id: "B", name: "Battleship", length: 4 },
  { id: "C", name: "Cruiser", length: 4 },
  { id: "D", name: "Submarine", length: 3 },
  { id: "E", name: "Destroyer", length: 2 },
];
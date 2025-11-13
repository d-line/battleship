export type Coord = { r: number; c: number};    // 0-indexed

export type Orientation = "H" | "V"; // Horizontal | Vertical

export type ShipKind =
  | { id: "A"; name: "Carrier"; length: 5 }
  | { id: "B"; name: "Battleship"; length: 4 }
  | { id: "C"; name: "Cruiser"; length: 4 }
  | { id: "D"; name: "Submarine"; length: 3 }
  | { id: "E"; name: "Destroyer"; length: 2 };

export type PlacedShip = {
    key: string
    kind: ShipKind["id"];
    bow: Coord;
    orientation: Orientation;
    coords: Coord[];
    hits: Set<string>;
}

export type Shot = {at: Coord; result: "hit" | "miss" | "sunk";};

export type FleetState = {
  ships: PlacedShip[];
  shotsTaken: Shot[];
  shotsReceived: Shot[];
};

export type PlayerId = "P1" | "P2";
export type Turn = PlayerId;

export type GameStatus = 
  | { phase: "placing"; current: PlayerId }
  | { phase: "ready"; current: PlayerId }
  | { phase: "playing"; turn: Turn }
  | { phase: "finished"; winner: PlayerId; loser: PlayerId };

export type PublicBoardView = {
  size: number;
  shots: {key: string; at:Coord; result: Shot["result"  ]}[]; // what we see of opponent's board
};

export type PrivateBoardView = {
  size: number;
  ships: { key: string; kind: ShipKind["id"]; coords: Coord[]}[]; // what we see of our own board
  shotsReceived: Shot[];
};

export interface IGameEngine {
    getStatus(): GameStatus;
    getPublicBoard(of: PlayerId): PublicBoardView;
    getPrivateBoard(me: PlayerId): PrivateBoardView;
    placeShip(
        me: PlayerId,
        kind: ShipKind["id"],
        bow: Coord,
        orientation: Orientation
    ): {ok: true; ship: PlacedShip} | {ok: false; reason: string};
    // removeShip(me: PlayerId, key: string): void;
    ready(me: PlayerId): void;
    fire(me: PlayerId, at: Coord): {ok: true; result: Shot} | {ok: false; reason: string};
    reset(): void;
}

export const keyOf = (coord: Coord) => `${coord.r},${coord.c}`;
export const eq = (a: Coord, b: Coord) => a.r === b.r && a.c === b.c;

export function spanCoords(bow: Coord, orient: Orientation, length: number): Coord[] {
  return Array.from({ length }, (_, i) =>
    orient === "H" ? { r: bow.r, c: bow.c + i } : { r: bow.r + i, c: bow.c }
  );
}

export function overlaps(a: Coord[], b: Coord[]): boolean {
  const set = new Set(a.map(keyOf));
  return b.some((c) => set.has(keyOf(c)));
}

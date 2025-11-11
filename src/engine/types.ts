export type Coord = { r: number; c: number};    // 0-indexed
export type Orientation = "H" | "V";
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
    // hits: Set<string>;
}

export type PrivateBoardView = {
  size: number;
  ships: { key: string; kind: ShipKind["id"]; coords: Coord[]}[];
};

export type PlayerId = "P1" | "P2";

export interface IGameEngine {
    placeShip(
        me: PlayerId,
        kind: ShipKind["id"],
        bow: Coord,
        orientation: Orientation
    ): {ok: true; ship: PlacedShip} | {ok: false; reason: string};
}

export function spanCoords(bow: Coord, orient: Orientation, length: number): Coord[] {
  return Array.from({ length }, (_, i) =>
    orient === "H" ? { r: bow.r, c: bow.c + i } : { r: bow.r + i, c: bow.c }
  );
}

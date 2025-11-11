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
    bow: Coord;
    orientation: Orientation;
    coords: Coord[];
    hits: Set<string>;
}
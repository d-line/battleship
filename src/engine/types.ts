export type Coord = { r: number; c: number};    // 0-indexed
export type Orientation = "H" | "V";

export type PlacedShip = {
    key: string
    bow: Coord;
    orientation: Orientation;
    coords: Coord[];
    hits: Set<string>;
}
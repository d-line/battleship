import { BOARD, SHIP_SET } from "./constant";
import { spanCoords, type Coord, type IGameEngine, type Orientation, type PlacedShip, type PlayerId, type PrivateBoardView, type ShipKind } from "./types";

export class LocalEngine implements IGameEngine {

    private fleets: Record<PlayerId, { ships: PlacedShip[]; }> = {
        P1: { ships: [] },
        P2: { ships: []},
    };

    getPrivateBoard(me: PlayerId): PrivateBoardView {
        return {
            size: BOARD.size,
            ships: this.fleets[me].ships.map((s) => ({ key: s.key, kind: s.kind, coords: s.coords })),

        };
    }


    placeShip(me: PlayerId, kind: ShipKind["id"], bow: Coord, orientation: Orientation) {
        console.log({ me, kind, bow, orientation });
        const spec = SHIP_SET.find((k) => k.id === kind)!;
        const coords = spanCoords(bow, orientation, spec.length);
        const inBounds = coords.every((c) => c.r >= 0 && c.c >= 0 && c.r < BOARD.size && c.c < BOARD.size);

        if (!inBounds) return { ok: false, reason: "Out of bounds" } as const;

        const ship: PlacedShip = {
            key: `${kind}#${Date.now()}#${Math.random().toString(36).slice(2, 6)}`,
            kind,
            bow,
            orientation,
            coords,
        };
        this.fleets[me].ships.push(ship);
        return { ok: true, ship } as const;


    }

}
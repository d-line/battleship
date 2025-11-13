import { BOARD, SHIP_SET } from "./constant";
import { eq, keyOf, overlaps, spanCoords, type Coord, type GameStatus, type IGameEngine, type Orientation, type PlacedShip, type PlayerId, type PrivateBoardView, type PublicBoardView, type ShipKind, type Shot } from "./types";

export class LocalEngine implements IGameEngine {

    private fleets: Record<PlayerId, { ships: PlacedShip[]; shotsTaken: Shot[]; shotsReceived: Shot[] }> = {
        P1: { ships: [], shotsTaken: [], shotsReceived: [] },
        P2: { ships: [], shotsTaken: [], shotsReceived: [] },
    };
    private placedReady: Record<PlayerId, boolean> = { P1: false, P2: false };
    private status: GameStatus = { phase: "placing", current: "P1" };

    getStatus(): GameStatus {
        return this.status;
    }

    getPrivateBoard(me: PlayerId): PrivateBoardView {
        return {
            size: BOARD.size,
            ships: this.fleets[me].ships.map((s) => ({ key: s.key, kind: s.kind, coords: s.coords })),
            shotsReceived: this.fleets[me].shotsReceived,
        };
    }

    getPublicBoard(me: PlayerId): PublicBoardView {
        return {
            size: BOARD.size,
            shots: this.fleets[me].shotsTaken.map((s, i) => ({ key: `S${i}`, at: s.at, result: s.result })),
        };
    }

    placeShip(me: PlayerId, kind: ShipKind["id"], bow: Coord, orientation: Orientation) {
        if (this.status.phase !== "placing" && this.status.phase !== "ready") return { ok: false, reason: "Placement closed" } as const;

        const spec = SHIP_SET.find((k) => k.id === kind)!;
        const coords = spanCoords(bow, orientation, spec.length);
        const inBounds = coords.every((c) => c.r >= 0 && c.c >= 0 && c.r < BOARD.size && c.c < BOARD.size);

        if (!inBounds) return { ok: false, reason: "Out of bounds" } as const;
        if (this.fleets[me].ships.find((s) => s.kind === kind)) return { ok: false, reason: "This ship already placed" } as const;
        if (this.fleets[me].ships.some((s) => overlaps(s.coords, coords))) return { ok: false, reason: "Overlaps another ship" } as const;

        const ship: PlacedShip = {
            key: `${kind}#${Date.now()}#${Math.random().toString(36).slice(2, 6)}`,
            kind,
            bow,
            orientation,
            coords,
            hits: new Set<string>(),
        };
        this.fleets[me].ships.push(ship);
        return { ok: true, ship } as const;
    }

    ready(me: PlayerId) {
        const haveAll = this.fleets[me].ships.length === SHIP_SET.length;
        if (!haveAll) return;
        this.placedReady[me] = true;
        if (this.placedReady.P1 && this.placedReady.P2) {
            const first: PlayerId = Math.random() < 0.5 ? "P1" : "P2";
            this.status = { phase: "playing", turn: first };
        } else {
            this.status = { phase: "ready", current: me };
        }
    }

    reset() {
        this.fleets = {
            P1: { ships: [], shotsTaken: [], shotsReceived: [] },
            P2: { ships: [], shotsTaken: [], shotsReceived: [] },
        };
        this.placedReady = { P1: false, P2: false };
        this.status = { phase: "placing", current: "P1" };
    }

    fire(me: PlayerId, at: Coord): {ok: true; result: Shot} | {ok: false; reason: string} {
        if (this.status.phase !== "playing") return { ok: false, reason: "Game not in playing phase" } as const;
        if (this.status.turn !== me) return { ok: false, reason: "Not your turn" } as const;

        const opponent: PlayerId = me === "P1" ? "P2" : "P1";
        const alreadyShot = this.fleets[me].shotsTaken.find((s) => eq(s.at, at));
        if (alreadyShot) return { ok: false, reason: "Duplicate shot" } as const;

        const targetShip = this.fleets[opponent].ships.find((s) => s.coords.some((c) => eq(c, at)));
        let result: Shot["result"] = "miss";
        if (targetShip) {
            targetShip.hits.add(keyOf(at));
            const sunk = targetShip.coords.every((c) => targetShip.hits.has(keyOf(c)));
            result = sunk ? "sunk" : "hit";
        }

        const shot: Shot = { at, result };
        this.fleets[me].shotsTaken.push(shot);
        this.fleets[opponent].shotsReceived.push(shot);

        const oppAllSunk = this.fleets[opponent].ships.every((s) => s.coords.every((c) => s.hits.has(keyOf(c))));
        if (oppAllSunk) this.status = { phase: "finished", winner: me, loser: opponent };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        else this.status = { phase: "playing", turn: opponent } as any;

        return { ok: true, result: shot } as const;
    }

}

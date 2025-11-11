import React from 'react';
import type { Orientation, ShipKind } from "../engine/types";

export type ShipSpec = { id: ShipKind["id"]; name: string; length: number };

type ShipPaletteProps = {
    ships: ShipSpec[];
    placed: ShipKind["id"][];
    dragShip: ShipSpec | null;
    setDragShip: (ship: ShipSpec | null) => void;
    orientation: Orientation;
}

export function ShipPalette(props: ShipPaletteProps) {
    const { ships, placed, setDragShip } = props;

    const onDragStart = (ship: ShipSpec) => (e: React.DragEvent<HTMLDivElement>) => {
        setDragShip(ship);
        e.dataTransfer.setData("text/plain", JSON.stringify({id: ship.id}));
    }

    const onDragEnd = () => {
        setDragShip(null);
    }

    return (
        <div className="p-3 bg-white rounded-xl border border-slate-200 mb-4">
            <h3 className="font-semibold mb-2">Fleet</h3>
            <div className="space-y-2">
                {ships.map((ship) => {
                    const isPlaced = placed.includes(ship.id);
                    return (
                        <div key={ship.id}
                            draggable={!isPlaced}
                            onDragStart={onDragStart(ship)}
                            onDragEnd={onDragEnd}
                            className={`flex items-center gap-2 p-2 rounded-lg border ${isPlaced ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-indigo-50 border-indigo-200"}`}
                        >
                            <div className="font-mono w-6 text-center">{ship.id}</div>
                            <div className="ml-auto text-xs">{ship.name} ({ship.length})</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export function Legend() {
    return (
        <div className="p-3 bg-white rounded-xl border border-slate-200">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="flex items-center gap-2 text-sm mb-1"><div className="w-5 h-5 bg-slate-800 rounded" /> Ship</div>
            <div className="flex items-center gap-2 text-sm mb-1"><div className="w-5 h-5 border-2 border-slate-800 rounded-full" /> Miss</div>
            <div className="flex items-center gap-2 text-sm"><div className="w-5 h-5 bg-rose-600 rounded" /> Hit / Sink</div>
        </div>
    );
}

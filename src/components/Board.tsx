import React, { useMemo, type JSX } from 'react';
import { overlaps, spanCoords, type Coord, type Orientation, type PrivateBoardView, type ShipKind, type Shot } from '../engine/types';
import { BOARD } from '../engine/constant';

export type CellShot = {at: Coord; result: Shot["result"] };

type PlaceBoardProps = {
    size: number;
    mode: "place";
    ships: PrivateBoardView["ships"];
    onDropCell: (r: number, c: number) => void;
    preview: null | { kind: ShipKind["id"]; length: number; orientation: Orientation };
    shots: CellShot[];
}

type AttackBoardProps = {
    size: number;
    mode: "attack";
    shots: CellShot[];
    onShootCell: (r: number, c: number) => void;
    disabled: boolean;
}

type BoardProps = PlaceBoardProps | AttackBoardProps;

type PlaceCellProps = {
    r: number;
    c: number;
    ships: PrivateBoardView['ships'];
    onDropCell: (r: number, c: number) => void;
    preview: null | { kind: ShipKind["id"]; length: number; orientation: Orientation };
    shots: CellShot[];
}

type AttackCellProps = {
    r: number;
    c: number;
    onShoot: (r: number, c: number) => void;
    shots: CellShot[];
    disabled: boolean;
}

function PlaceCell(props: PlaceCellProps) {
    const { r, c, ships, onDropCell, preview, shots } = props;

    const presenceOfShip = ships.some(ship =>
        ship.coords.some(coord => coord.r === r && coord.c === c)
    );

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => { e.preventDefault(); };
    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => { e.preventDefault(); onDropCell(r, c); };

    const isPreview = useMemo(() => {
        if (!preview) return false;
        const coords = spanCoords({ r, c }, preview.orientation, preview.length);
        const inBounds = coords.every((p) => p.r >= 0 && p.c >= 0 && p.r < BOARD.size && p.c < BOARD.size);
        if (!inBounds) return false;
        const conflict = ships.some((s) => overlaps(s.coords, coords));
        return !conflict;
    }, [preview, r, c, ships]);

    const shot = shots.find((s) => s.at.r === r && s.at.c === c);
    let content: JSX.Element | null = null;

    if (shot) {
        // Same visuals as AttackCell
        if (shot.result === "miss") {
            content = <div className="w-5 h-5 rounded-full border-2 border-slate-800" />;
        } else {
            // hit or sink
            content = <div className="w-6 h-6 bg-rose-600 rounded" />;
        }
    } else if (presenceOfShip) {
        content = <div className="w-6 h-6 rounded bg-slate-800" />;
    }

    return (
        <div draggable={false} onDragOver={handleDragOver} onDrop={handleDrop} 
        className={`w-8 h-8 border border-slate-300 flex items-center justify-center select-none ${isPreview ? "bg-indigo-200" : "bg-white"}`}>
            { content }
        </div>
    )
}

function AttackCell(props: AttackCellProps) {
    const { r, c, onShoot, shots, disabled } = props;
    const shot = shots.find((s) => s.at.r === r && s.at.c === c);

    const handleClick = () => { if (!disabled && !shot) onShoot(r, c); };

    let cell = <div className="w-6 h-6" />;
    if (shot) {
        if (shot.result === "miss") cell = <div className="w-5 h-5 rounded-full border-2 border-slate-800"/>;
        if (shot.result === "hit" || shot.result === "sunk") cell = <div className="w-6 h-6 bg-rose-600 rounded"/>;
    }
    return (
        <div onClick={handleClick} className={`w-8 h-8 border cursor-pointer border-slate-300 flex items-center justify-center ${disabled ? "bg-slate-100" : "bg-white hover:bg-slate-100"}`}>
            {cell}
        </div>);
}

function AxisLabels({ size }: { size: number }) {
    return (
        <div className='flex'>
            {Array.from({ length: size }).map((_, i) => (
                <div key={i} className="w-8 text-center text-[10px] text-slate-500">{i + 1}</div>
            ))}
        </div>
    );
}

export function Board(props: BoardProps) {
    const size = props.size;

    const grid: JSX.Element[] = [];

    // Grid generation TODO: move to helper function
    for (let r = 0; r < size; r++) {
        const row: JSX.Element[] = [];
        for (let c = 0; c < size; c++) {
            if (props.mode === 'place') {
                row.push(<PlaceCell key={c} r={r} c={c} ships={props.ships} onDropCell={props.onDropCell} preview={props.preview} shots={props.shots}/>);
            } else {
                row.push(<AttackCell key={c} r={r} c={c} shots={props.shots} onShoot={props.onShootCell} disabled={props.disabled} />);
            }

        }
        grid.push(<div key={r} className="flex">{row}</div>);
    }

    return (
        <div className="inline-block border-4 border-slate-800 rounded-xl overflow-hidden">
            {grid}
            <AxisLabels size={size} />
        </div>
    );
}

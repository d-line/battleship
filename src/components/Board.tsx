import React, { type JSX } from 'react';
import type { PlacedShip } from '../engine/types';

type PlaceBoardProps = {
    size: number;
    mode: "place";
    ships: PlacedShip[];
    onDropCell: (r: number, c: number) => void;
}

type AttackBoardProps = {
    size: number;
    mode: "attack";
}

type BoardProps = PlaceBoardProps | AttackBoardProps;

type PlaceCellProps = {
    r: number;
    c: number;
    ships: PlacedShip[];
    onDropCell: (r: number, c: number) => void;
}

type AttackCellProps = {
    r: number;
    c: number;
    ships: PlacedShip[];
}

function PlaceCell(props: PlaceCellProps) {
    const { r, c, ships, onDropCell } = props;

    const presenceOfShip = ships.some(ship =>
        ship.coords.some(coord => coord.r === r && coord.c === c)
    );

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => { e.preventDefault(); };
    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => { e.preventDefault(); onDropCell(r, c); };

    return (
        <div draggable={false} onDragOver={handleDragOver} onDrop={handleDrop} className={`w-8 h-8 border border-slate-300 flex items-center justify-center select-none bg-white`}>
            {presenceOfShip && <div className='w-6 h-6 bg-slate-800 rounded' />}
        </div>
    )
}

function AttackCell(props: AttackCellProps) {
    // const { r, c } = props;
    const cell = <div className="w-6 h-6" />;

    return (
        <div className={`w-8 h-8 border cursor-pointer border-slate-300 flex items-center justify-center bg-white hover:bg-slate-100}`}>
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
                row.push(<PlaceCell key={c} r={r} c={c} ships={props.ships} onDropCell={props.onDropCell} />);
            } else {
                row.push(<AttackCell key={c} r={r} c={c} />);
                // Attack mode cell (not implemented yet)
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

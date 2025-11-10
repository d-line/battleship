import React, { type JSX } from 'react';

type BoardProps = {
    size: number
}

type PlaceCellProps = {
    r: number;
    c: number;
}
function PlaceCell(props: PlaceCellProps) {
    const {r, c} = props;

    return (
        <div draggable={false} className={`w-8 h-8 border border-slate-300 flex items-center justify-center select-none bg-white`}>
            {r}/{c}
        </div>
    )
}

function AxisLabels({size}: {size: number}) {
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
            row.push(<PlaceCell key={c} r={r} c={c}/>)
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GameStatus } from "../engine/types";

export function StatusRibbon({ status }: { status: GameStatus }) {
  let text = "";
  if (status.phase === "placing") text = "Place your fleet.";
  if (status.phase === "ready") text = "Waiting for opponent readiness.";
  if (status.phase === "playing") text = (status as any).turn === "P1" ? "Your turn." : "Opponent's turn.";
  if (status.phase === "finished") text = `Game over — ${status.winner} wins.`;
  return (
    <div className="rounded-xl bg-slate-900 text-white px-4 py-3">{text}</div>
  );
}
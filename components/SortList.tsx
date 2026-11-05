"use client";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
export type SortItem = { id: string; title: string; sub?: string; image?: string; extra?: React.ReactNode };

/** Reorderable list: drag the handle (desktop) or use the arrows (works on touch). Nothing is saved until “Save order”. */
export default function SortList({ items, save, empty = "Nothing here yet." }: { items: SortItem[]; save: (ids: string[]) => Promise<void>; empty?: string }) {
  const [rows, setRows] = useState(items), [drag, setDrag] = useState<number | null>(null), [busy, go] = useTransition(), [saved, setSaved] = useState(false);
  const dirty = rows.map(r => r.id).join() !== items.map(r => r.id).join();
  const move = (from: number, to: number) => { if (to < 0 || to >= rows.length || from === to) return; const n = [...rows]; n.splice(to, 0, n.splice(from, 1)[0]); setRows(n); setSaved(false); };
  if (!rows.length) return <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-muted">{empty}</p>;
  return (<div className="space-y-3">
    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
      {rows.map((r, i) => <li key={r.id} onDragOver={e => { if (drag !== null) e.preventDefault(); }} onDrop={e => { e.preventDefault(); if (drag !== null) move(drag, i); setDrag(null); }} className={`flex flex-wrap items-center gap-3 p-3 ${drag === i ? "bg-brand-50" : ""}`}>
        <span draggable onDragStart={e => { setDrag(i); e.dataTransfer.setData("text/plain", r.id); e.dataTransfer.effectAllowed = "move"; }} onDragEnd={() => setDrag(null)} className="cursor-grab touch-none text-slate-400 active:cursor-grabbing" title="Drag to reorder"><GripVertical size={18} /></span>
        <span className="w-6 text-center text-sm font-semibold text-muted">{i + 1}</span>
        {r.image !== undefined && (/* eslint-disable-next-line @next/next/no-img-element */ r.image ? <img src={r.image} alt="" className="h-12 w-12 rounded border border-line bg-white object-contain" /> : <span className="h-12 w-12 rounded border border-line bg-paper" />)}
        <div className="min-w-0 flex-1 basis-40"><p className="truncate font-medium">{r.title}</p>{r.sub && <p className="truncate text-xs text-muted">{r.sub}</p>}</div>
        {r.extra}
        <div className="flex gap-1"><button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)} className="rounded border border-line p-1.5 hover:border-brand disabled:opacity-30"><ArrowUp size={16} /></button><button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, i + 1)} className="rounded border border-line p-1.5 hover:border-brand disabled:opacity-30"><ArrowDown size={16} /></button></div>
      </li>)}
    </ul>
    <div className="flex items-center gap-3"><button type="button" disabled={!dirty || busy} onClick={() => go(async () => { await save(rows.map(r => r.id)); setSaved(true); })} className="btn">{busy ? "Saving…" : "Save order"}</button>{saved && !dirty && <span className="text-sm text-brand">Order saved.</span>}{dirty && <span className="text-sm text-muted">Unsaved changes</span>}</div>
  </div>);
}

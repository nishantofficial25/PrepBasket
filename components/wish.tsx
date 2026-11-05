"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
// Wishlist lives in the visitor's browser (localStorage). No account, no cookies, nothing sent to the server.
const KEY = "sb_wish";
const read = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export function useWish() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { const sync = () => setIds(read()); sync(); window.addEventListener("sb-wish", sync); window.addEventListener("storage", sync); return () => { window.removeEventListener("sb-wish", sync); window.removeEventListener("storage", sync); }; }, []);
  const toggle = (id: string) => { const cur = read(), next = cur.includes(id) ? cur.filter(x => x !== id) : [id, ...cur].slice(0, 100); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} window.dispatchEvent(new Event("sb-wish")); };
  return { ids, toggle };
}
export function WishButton({ id, className = "" }: { id: string; className?: string }) {
  const { ids, toggle } = useWish(), on = ids.includes(id);
  return <button type="button" onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(id); }} aria-pressed={on} aria-label={on ? "Remove from wishlist" : "Save to wishlist"} className={`grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-soft transition-colors hover:text-red-500 ${on ? "text-red-500" : "text-slate-500"} ${className}`}><Heart size={17} className={on ? "fill-current" : ""} /></button>;
}
export function WishCount() { const { ids } = useWish(); return ids.length ? <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{ids.length}</span> : null; }

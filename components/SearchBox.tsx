"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
type S = { name: string; slug: string; image: string };
export default function SearchBox({ autoFocus = false }: { autoFocus?: boolean }) {
  const path = usePathname(), sp = useSearchParams();
  const current = path === "/search" ? sp.get("q") ?? "" : "";
  const [v, setV] = useState(current), [r, setR] = useState<S[]>([]), [open, setOpen] = useState(false);
  useEffect(() => setV(current), [current]);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (v.trim().length < 2) { setR([]); return; }
    const c = new AbortController();
    const t = setTimeout(async () => { try { setR(await (await fetch(`/api/suggest?q=${encodeURIComponent(v)}`, { signal: c.signal })).json()); } catch {} }, 200);
    return () => { clearTimeout(t); c.abort(); };
  }, [v]);
  return (
    <div className="relative w-full" onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <form action="/search" role="search" className="flex items-center overflow-hidden rounded-md border border-slate-300 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <input name="q" value={v} onChange={e => { setV(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} autoComplete="off" autoFocus={autoFocus} placeholder="Search products, exams, brands" aria-label="Search products" className="h-10 min-w-0 flex-1 bg-transparent px-3.5 text-sm outline-none" />
        <button aria-label="Search" className="grid h-10 w-11 place-items-center bg-brand text-white transition-colors hover:bg-brand-600"><Search size={18} /></button>
      </form>
      {open && v.trim().length > 1 && (
        <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-line bg-white shadow-pop">
          {r.map(s => <li key={s.slug}><Link href={`/product/${s.slug}`} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-brand-50">{/* eslint-disable-next-line @next/next/no-img-element */}{s.image && <img src={s.image} alt="" className="h-9 w-9 rounded bg-white object-contain" />}<span className="line-clamp-1">{s.name}</span></Link></li>)}
          <li><Link href={`/search?q=${encodeURIComponent(v)}`} className="block border-t border-line bg-paper px-3 py-2 text-sm font-semibold text-brand">See all results for “{v}”</Link></li>
        </ul>)}
    </div>);
}

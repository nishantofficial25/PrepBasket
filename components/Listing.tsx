import Link from "next/link";
import { Star } from "lucide-react";
import { list, count } from "@/lib/db";
import { getCategories, getProviders } from "@/lib/catalog";
import { parseFilters, buildQuery, getFacets, SORTS, PER, type SP } from "@/lib/listing";
import ProductGrid from "./ProductGrid";
import Pager from "./Pager";
import { Empty } from "./Card";
import { SortSelect } from "./FilterBits";

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => <fieldset className="border-b border-line py-4 first:pt-0 last:border-0"><legend className="mb-3 float-left w-full text-sm font-semibold">{title}</legend><div className="clear-both space-y-2">{children}</div></fieldset>;
const Check = ({ name, value, label, n, on }: { name: string; value: string; label: string; n?: number; on: boolean }) => <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="checkbox" name={name} value={value} defaultChecked={on} /><span className="flex-1">{label}</span>{n != null && <span className="text-xs text-muted">({n})</span>}</label>;

/** Filter sidebar + sorted, paginated product grid. `base` is the fixed part of the query (e.g. one category). */
export default async function Listing({ base, path, sp, categoryFacet }: { base: any; path: string; sp: SP; categoryFacet?: boolean }) {
  const f = parseFilters(sp), q = buildQuery(base, f);
  const [items, total, fc, cats, provs] = await Promise.all([list(q, { skip: (f.page - 1) * PER, limit: PER, sort: SORTS[f.sort] }), count(q), getFacets(base), getCategories(), getProviders()]);
  const href = (patch: Record<string, string | undefined>) => { const u = new URLSearchParams(); for (const [k, v] of [["sub", f.subs], ["brand", f.brands], ["cat", f.cats]] as const) v.forEach(x => u.append(k, x)); if (f.store) u.set("store", f.store); if (f.min != null) u.set("min", String(f.min)); if (f.max != null) u.set("max", String(f.max)); if (f.rating) u.set("rating", String(f.rating)); if (f.sort !== "pop") u.set("sort", f.sort); for (const [k, v] of Object.entries(patch)) v == null ? u.delete(k) : u.set(k, v); const s = u.toString(); return s ? `${path}?${s}` : path; };
  const presets: [string, string | undefined, string | undefined][] = [["Under ₹200", undefined, "199"], ["₹200 – ₹500", "200", "500"], ["₹500 – ₹1,000", "500", "1000"], ["Over ₹1,000", "1000", undefined]];
  const active = f.subs.length + f.brands.length + f.cats.length + (f.store ? 1 : 0) + (f.min != null || f.max != null ? 1 : 0) + (f.rating ? 1 : 0);
  const from = total ? (f.page - 1) * PER + 1 : 0, to = Math.min(total, f.page * PER);
  const catList = cats.filter(c => fc.cats[c.slug]);
  return (<div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
    <aside className="hidden lg:block"><form id="filters" action={path} className="panel p-4">
      <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Filters</h2>{active > 0 && <Link href={path} className="text-xs font-semibold text-brand hover:underline">Clear all</Link>}</div>
      {categoryFacet && catList.length > 1 && <Group title="Category">{catList.map(c => <Check key={c.slug} name="cat" value={c.slug} label={c.name} n={fc.cats[c.slug]} on={f.cats.includes(c.slug)} />)}</Group>}
      {fc.subs.length > 0 && <Group title="Type">{fc.subs.map(([s, n]) => <Check key={s} name="sub" value={s} label={s} n={n} on={f.subs.includes(s)} />)}</Group>}
      {fc.brands.length > 0 && <Group title="Brand">{fc.brands.map(([s, n]) => <Check key={s} name="brand" value={s} label={s} n={n} on={f.brands.includes(s)} />)}</Group>}
      {provs.length > 1 && <Group title="Store"><select name="store" defaultValue={f.store || ""} className="inp"><option value="">All stores</option>{provs.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></Group>}
      {fc.maxPrice > 0 && <Group title="Price range"><div className="flex items-center gap-2"><input name="min" type="number" min={0} inputMode="numeric" placeholder="Min ₹" defaultValue={f.min} aria-label="Minimum price" className="inp" /><span className="text-muted">–</span><input name="max" type="number" min={0} inputMode="numeric" placeholder="Max ₹" defaultValue={f.max} aria-label="Maximum price" className="inp" /></div>
        <div className="flex flex-wrap gap-1.5 pt-1">{presets.map(([l, a, b]) => { const on = f.min === (a ? +a : undefined) && f.max === (b ? +b : undefined); return <Link key={l} href={href({ min: a, max: b, page: undefined })} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${on ? "border-brand bg-brand-50 text-brand" : "border-line hover:border-brand"}`}>{l}</Link>; })}</div></Group>}
      <Group title="Customer rating">{[4, 3, 2].map(r => <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"><input type="radio" name="rating" value={r} defaultChecked={f.rating === r} /><span className="flex">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className={i <= r ? "fill-amber-500 text-amber-500" : "text-slate-300"} />)}</span>& above</label>)}{f.rating ? <Link href={href({ rating: undefined })} className="text-xs text-muted hover:text-brand">Any rating</Link> : null}</Group>
      <button className="btn mt-2 w-full">Apply filters</button>
    </form></aside>
    <section>
      <div className="mb-4 hidden flex-wrap items-center justify-between gap-3 lg:flex"><p className="text-sm text-muted">{total ? `Showing ${from} – ${to} of ${total} product${total === 1 ? "" : "s"}` : "No products found"}</p><label className="flex items-center gap-2 text-sm text-muted">Sort by:<SortSelect form="filters" value={f.sort} /></label></div>
      {items.length ? <ProductGrid items={items} cols={3} /> : <Empty>No products match these filters. <Link href={path} className="font-semibold text-brand">Clear all filters</Link></Empty>}
      <Pager page={f.page} total={total} per={PER} base={path} params={{ sub: f.subs, brand: f.brands, cat: f.cats, store: f.store, min: f.min?.toString(), max: f.max?.toString(), rating: f.rating?.toString(), sort: f.sort === "pop" ? undefined : f.sort }} />
    </section></div>);
}

import Link from "next/link";
import { list, count, esc } from "@/lib/db";
import { getCategories, getProviders } from "@/lib/catalog";
import { getExams } from "@/lib/exams";
import { clicksFor, totalClicks } from "@/lib/redis";
import { requireAdmin } from "@/lib/auth";
import { remove, toggle, logout } from "@/lib/actions";
import Confirm from "@/components/Confirm";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };
const PER = 15;
export default async function Admin({ searchParams }: any) {
  await requireAdmin();
  const page = Math.max(1, +searchParams.page || 1), q: any = {};
  if (searchParams.q) q.name = { $regex: esc(String(searchParams.q)), $options: "i" };
  if (searchParams.cat) q.category = searchParams.cat;
  if (searchParams.exam) q.exams = searchParams.exam;
  if (searchParams.store) q.provider = searchParams.store;
  const sort = searchParams.sort === "name" ? { name: 1 } : { _id: -1 };
  const [items, total, all, act, feat, exams, tc, cats, provs] = await Promise.all([list(q, { skip: (page - 1) * PER, limit: PER, sort }), count(q), count(), count({ active: true }), count({ featured: true }), getExams(), totalClicks(), getCategories(), getProviders()]);
  const clicks = await clicksFor(items.map(p => p.id!));
  const cn = Object.fromEntries(cats.map(c => [c.slug, c.name])), pn = Object.fromEntries(provs.map(p => [p.slug, p.name]));
  const stats = [["Products", all], ["Active", act], ["Featured", feat], ["Categories", cats.length], ["Stores", provs.length], ["Store clicks", tc]];
  const pill = "rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:border-brand";
  const keep = new URLSearchParams(Object.entries(searchParams).filter(([k, v]) => k !== "page" && v) as any).toString();
  const pg = (n: number) => `?${keep ? keep + "&" : ""}page=${n}`;
  return (<div className="wrap space-y-6 py-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Dashboard</h1><div className="flex gap-2"><Link href="/admin/product" className="btn">Add product</Link><form action={logout}><button className="btn-ghost">Sign out</button></form></div></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">{stats.map(([l, n]) => <div key={l} className="panel p-4"><p className="text-xs font-medium text-muted">{l}</p><p className="text-2xl font-bold">{n}</p></div>)}</div>
    <form className="flex flex-wrap gap-2"><input name="q" defaultValue={searchParams.q} placeholder="Search name" className="inp !w-48" /><select name="cat" defaultValue={searchParams.cat || ""} className="inp !w-44"><option value="">All categories</option>{cats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select><select name="store" defaultValue={searchParams.store || ""} className="inp !w-36"><option value="">All stores</option>{provs.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select><select name="exam" defaultValue={searchParams.exam || ""} className="inp !w-36"><option value="">All exams</option>{exams.map(e => <option key={e.slug} value={e.slug}>{e.name}</option>)}</select><select name="sort" defaultValue={searchParams.sort || ""} className="inp !w-32"><option value="">Newest</option><option value="name">Name A–Z</option></select><button className="btn">Filter</button></form>
    {items.length ? <ul className="panel divide-y divide-line overflow-hidden">{items.map(p => <li key={p.id} className="flex flex-wrap items-center gap-3 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}{p.image ? <img src={p.image} alt="" className="h-12 w-12 rounded border border-line bg-white object-contain" /> : <span className="h-12 w-12 rounded border border-line bg-paper" />}
      <div className="min-w-0 flex-1 basis-48"><p className="truncate font-medium">{p.name}</p><p className="text-xs text-muted">{cn[p.category] || p.category}{p.provider ? ` · ${pn[p.provider] || p.provider}` : ""}{p.exams?.length ? ` · ${p.exams.join(", ")}` : ""}</p></div>
      <span className="rounded bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-700" title="Unique store clicks">{clicks[p.id!] ?? 0} clicks</span>
      <form action={toggle.bind(null, p.id!, "active", !p.active)}><button className={`${pill} ${p.active ? "border-green-300 text-green-700" : "text-muted"}`}>{p.active ? "Active" : "Inactive"}</button></form>
      <form action={toggle.bind(null, p.id!, "featured", !p.featured)}><button className={`${pill} ${p.featured ? "border-brand text-brand-700" : "text-muted"}`}>{p.featured ? "Featured" : "Not featured"}</button></form>
      <Link href={`/admin/product?id=${p.id}`} className="text-sm font-semibold text-brand">Edit</Link>
      <Confirm action={remove.bind(null, p.id!)} msg="Delete this product permanently?" className="text-sm font-semibold text-red-600">Delete</Confirm></li>)}</ul> : <p className="panel border-dashed p-8 text-center text-muted">No products found.</p>}
    <div className="flex gap-3">{page > 1 && <Link className="btn-ghost" href={pg(page - 1)}>Previous</Link>}{page * PER < total && <Link className="btn" href={pg(page + 1)}>Next</Link>}</div></div>);
}

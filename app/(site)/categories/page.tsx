import Link from "next/link";
import { getCategories, categoryCounts } from "@/lib/catalog";
import CatIcon from "@/components/icons";
import { Empty } from "@/components/Card";
export const metadata = { title: "Categories", alternates: { canonical: "/categories" } };
export default async function Categories() {
  const [cats, n] = await Promise.all([getCategories(), categoryCounts()]);
  return <div className="wrap py-5 sm:py-7"><h1 className="mb-5 text-2xl font-bold tracking-tight sm:text-3xl">Shop by category</h1>
    {cats.length ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">{cats.map((c, i) => <Link key={c.slug} href={`/category/${c.slug}`} className={`flex items-center gap-4 rounded-2xl p-5 transition-shadow hover:shadow-pop ${i % 2 ? "bg-sand" : "bg-brand-100"}`}><span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white text-brand"><CatIcon name={c.icon} size={26} /></span><span className="min-w-0"><span className="block font-bold leading-snug">{c.name}</span><span className="text-xs text-slate-700">{n[c.slug] || 0} items</span></span></Link>)}</div> : <Empty>No categories yet.</Empty>}</div>;
}

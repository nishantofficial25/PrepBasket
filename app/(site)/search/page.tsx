import Link from "next/link";
import { fuzzy } from "@/lib/search";
import { getCategories } from "@/lib/catalog";
import { Empty } from "@/components/Card";
import ProductGrid from "@/components/ProductGrid";
export const metadata = { title: "Search", robots: { index: false } };
export default async function S({ searchParams }: any) {
  const q = String(searchParams.q || "").trim().slice(0, 80);
  const [items, cats] = await Promise.all([q ? fuzzy(q) : Promise.resolve([]), getCategories()]);
  return (<div className="wrap py-6 sm:py-8"><h1 className="text-xl font-bold tracking-tight sm:text-2xl">{q ? `${items.length} result${items.length === 1 ? "" : "s"} for “${q}”` : "Search products"}</h1>
    {!q && <p className="mt-1 text-sm text-muted">Use the search bar above. It tolerates typos and matches names, exams, categories and stores.</p>}
    <div className="mt-5">{q && !items.length ? <Empty>No close matches. Try fewer words, or browse: {cats.map(c => <Link key={c.slug} href={`/category/${c.slug}`} className="chip m-1">{c.name}</Link>)}</Empty> : <ProductGrid items={items} />}</div></div>);
}

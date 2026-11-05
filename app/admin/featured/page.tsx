import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { list, featuredSort } from "@/lib/db";
import { getCategories } from "@/lib/catalog";
import { saveFeaturedOrder, toggle } from "@/lib/actions";
import SortList from "@/components/SortList";
export const dynamic = "force-dynamic";
export default async function Featured() {
  await requireAdmin();
  const [items, cats] = await Promise.all([list({ featured: true }, { limit: 200, sort: featuredSort }), getCategories()]);
  const cn = Object.fromEntries(cats.map(c => [c.slug, c.name]));
  return <div className="wrap max-w-3xl space-y-5 py-8"><div><h1 className="text-2xl font-bold">Featured order</h1><p className="mt-1 text-sm text-muted">This is the order of “Featured picks” on the home page. Drag the handle or use the arrows, then save. Mark more products as featured from the <Link href="/admin" className="font-semibold text-brand">product list</Link>.</p></div>
    <SortList key={items.map(i => i.id).join()} save={saveFeaturedOrder} empty="No featured products yet. Use the “Not featured” button on a product to feature it."
      items={items.map(p => ({ id: p.id!, title: p.name, sub: `${cn[p.category] || p.category}${p.active ? "" : " · inactive (hidden from site)"}`, image: p.image, extra: <form action={toggle.bind(null, p.id!, "featured", false)}><button className="text-sm font-semibold text-red-600">Remove</button></form> }))} /></div>;
}

import type { Product } from "@/lib/db";
import { getProviders, getCategories } from "@/lib/catalog";
import Card from "./Card";
const COLS = { 3: "grid-cols-2 md:grid-cols-3", 4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4", 5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" };
export default async function ProductGrid({ items, cols = 4 }: { items: Product[]; cols?: 3 | 4 | 5 }) {
  const [provs, cats] = await Promise.all([getProviders(), getCategories()]);
  const sn = Object.fromEntries(provs.map(p => [p.slug, p.name])), cn = Object.fromEntries(cats.map(c => [c.slug, c.name]));
  return <div className={`grid gap-3 sm:gap-4 ${COLS[cols]}`}>{items.map(p => <Card key={p.id} p={p} store={sn[p.provider || ""]} cat={cn[p.category]} />)}</div>;
}

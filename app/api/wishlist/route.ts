import { NextRequest, NextResponse } from "next/server";
import { list, ObjectId } from "@/lib/db";
import { getCategories, getProviders } from "@/lib/catalog";
export async function GET(r: NextRequest) {
  const ids = (r.nextUrl.searchParams.get("ids") || "").split(",").filter(i => /^[a-f0-9]{24}$/.test(i)).slice(0, 100);
  if (!ids.length) return NextResponse.json({ items: [], stores: {}, cats: {} });
  const [items, provs, cats] = await Promise.all([list({ active: true, _id: { $in: ids.map(i => new ObjectId(i)) } }, { limit: 100 }), getProviders(), getCategories()]);
  return NextResponse.json({ items, stores: Object.fromEntries(provs.map(p => [p.slug, p.name])), cats: Object.fromEntries(cats.map(c => [c.slug, c.name])) });
}

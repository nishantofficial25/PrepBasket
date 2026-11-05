import { coll } from "./db";
export const PER = 12;
export type SP = Record<string, string | string[] | undefined>;
const arr = (v: any): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]).map(String).filter(Boolean);
const num = (v: any) => { const n = parseFloat(Array.isArray(v) ? v[0] : v); return Number.isFinite(n) && n >= 0 ? n : undefined; };
export const SORTS: Record<string, any> = { pop: { featured: -1, _id: -1 }, new: { _id: -1 }, low: { price: 1, _id: -1 }, high: { price: -1, _id: -1 } };
export type Filters = { subs: string[]; brands: string[]; cats: string[]; store?: string; min?: number; max?: number; rating?: number; sort: string; page: number };

export function parseFilters(sp: SP): Filters {
  const sort = typeof sp.sort === "string" && SORTS[sp.sort] ? sp.sort : "pop";
  return { subs: arr(sp.sub).slice(0, 20), brands: arr(sp.brand).slice(0, 20), cats: arr(sp.cat).slice(0, 20), store: typeof sp.store === "string" ? sp.store : undefined, min: num(sp.min), max: num(sp.max), rating: num(sp.rating), sort, page: Math.max(1, Math.floor(num(sp.page) || 1)) };
}
export function buildQuery(base: any, f: Filters) {
  const q: any = { ...base };
  if (f.subs.length) q.subcategory = { $in: f.subs };
  if (f.brands.length) q.brand = { $in: f.brands };
  if (f.cats.length) q.category = { $in: f.cats };
  if (f.store) q.provider = f.store;
  if (f.min != null || f.max != null || f.sort === "low" || f.sort === "high") { q.price = { $gt: 0 }; if (f.min != null) q.price.$gte = f.min; if (f.max != null) q.price.$lte = f.max; }
  if (f.rating) q.rating = { $gte: f.rating };
  return q;
}
export type Facets = { subs: [string, number][]; brands: [string, number][]; cats: Record<string, number>; maxPrice: number };
export async function getFacets(base: any): Promise<Facets> {
  const grp = (field: string) => [{ $match: { [field]: { $nin: ["", null] } } }, { $group: { _id: `$${field}`, n: { $sum: 1 } } }, { $sort: { n: -1, _id: 1 } }, { $limit: 30 }];
  try {
    const [r]: any[] = await (await coll("products")).aggregate([{ $match: base }, { $facet: { subs: grp("subcategory"), brands: grp("brand"), cats: [{ $group: { _id: "$category", n: { $sum: 1 } } }], mp: [{ $group: { _id: null, m: { $max: "$price" } } }] } }]).toArray();
    return { subs: r.subs.map((x: any) => [x._id, x.n]), brands: r.brands.map((x: any) => [x._id, x.n]), cats: Object.fromEntries(r.cats.map((x: any) => [x._id, x.n])), maxPrice: r.mp[0]?.m || 0 };
  } catch { return { subs: [], brands: [], cats: {}, maxPrice: 0 }; }
}

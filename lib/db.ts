import { MongoClient, ObjectId } from "mongodb";

const g = globalThis as any;

async function getDb() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  if (!g._m) {
    g._m = new MongoClient(process.env.MONGODB_URI).connect().then(async c => {
      const db = c.db();
      // Indexes are created once per server start; failures (e.g. legacy duplicate slugs) never block the site.
      await Promise.allSettled([
        db.collection("products").createIndex({ slug: 1 }, { unique: true }),
        db.collection("products").createIndex({ active: 1, category: 1, _id: -1 }),
        db.collection("products").createIndex({ active: 1, featured: 1, featuredOrder: 1 }),
        db.collection("categories").createIndex({ slug: 1 }, { unique: true }),
        db.collection("providers").createIndex({ slug: 1 }, { unique: true }),
        db.collection("exams").createIndex({ slug: 1 }, { unique: true }),
        db.collection("subscribers").createIndex({ email: 1 }, { unique: true }),
        db.collection("banners").createIndex({ placement: 1, order: 1 }),
      ]);
      return c;
    }).catch(e => { g._m = undefined; throw e; });
  }
  return (await g._m as MongoClient).db();
}

export const coll = async (name: string) => (await getDb()).collection(name);
export const col = () => coll("products");
export { ObjectId };

export type Product = {
  _id?: any; id?: string; name: string; slug: string; description: string; image: string;
  category: string; subcategory: string; brand?: string; exams?: string[];
  affiliateUrl: string; provider?: string;
  price?: number | null; rating?: number | null; reviewCount?: number | null;
  featured: boolean; featuredOrder?: number | null; active: boolean;
};

const fix = (d: any): Product => ({ ...d, id: String(d._id), _id: undefined });

export async function list(q: any = {}, opt: { skip?: number; limit?: number; sort?: any } = {}): Promise<Product[]> {
  try {
    const c = await col();
    return (await c.find(q).sort(opt.sort ?? { _id: -1 }).skip(opt.skip ?? 0).limit(opt.limit ?? 48).toArray()).map(fix);
  } catch { return []; }
}
export const count = async (q: any = {}) => { try { return await (await col()).countDocuments(q); } catch { return 0; } };
export async function bySlug(slug: string) {
  try { const d = await (await col()).findOne({ slug, active: true }); return d ? fix(d) : null; } catch { return null; }
}
export const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const featuredSort = { featuredOrder: 1, _id: -1 } as const;

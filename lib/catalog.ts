import { cache } from "react";
import { coll } from "./db";

export type Category = { id: string; name: string; slug: string; icon: string; description: string; order: number };
export type Provider = { id: string; name: string; slug: string; domains: string[]; order: number };

export const DEFAULT_CATEGORIES = [
  { name: "Stationery", slug: "stationery", icon: "pen-line" },
  { name: "Exam Preparation Books", slug: "exam-preparation-books", icon: "book-open" },
  { name: "Study Accessories", slug: "study-accessories", icon: "backpack" },
  { name: "Technology", slug: "technology", icon: "laptop" },
  { name: "Student Essentials", slug: "student-essentials", icon: "shopping-bag" },
];
export const DEFAULT_PROVIDERS = [
  { name: "Amazon", slug: "amazon", domains: ["amazon.in", "amazon.com", "amzn.to", "amzn.in", "amzlinks.in", "link.amazon"] },
  { name: "Flipkart", slug: "flipkart", domains: ["flipkart.com", "fkrt.it", "fkrt.cc", "dl.flipkart.com"] },
  { name: "Meesho", slug: "meesho", domains: ["meesho.com"] },
];

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// react `cache` de-duplicates these within one request (layout + page + footer all ask for them).
export const getCategories = cache(async (): Promise<Category[]> => {
  try {
    return (await (await coll("categories")).find().sort({ order: 1, name: 1 }).toArray())
      .map((d: any) => ({ id: String(d._id), name: d.name, slug: d.slug, icon: d.icon || "tag", description: d.description || "", order: d.order ?? 0 }));
  } catch { return []; }
});

export const getProviders = cache(async (): Promise<Provider[]> => {
  try {
    return (await (await coll("providers")).find().sort({ order: 1, name: 1 }).toArray())
      .map((d: any) => ({ id: String(d._id), name: d.name, slug: d.slug, domains: d.domains || [], order: d.order ?? 0 }));
  } catch { return []; }
});

export function detectProvider(hostname: string, providers: Provider[]): string {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  return providers.find(p => p.domains.some(d => h === d || h.endsWith("." + d)))?.slug ?? "";
}

export async function categoryCounts(): Promise<Record<string, number>> {
  try {
    const rows = await (await coll("products")).aggregate([{ $match: { active: true } }, { $group: { _id: "$category", n: { $sum: 1 } } }]).toArray();
    return Object.fromEntries(rows.map((r: any) => [r._id, r.n]));
  } catch { return {}; }
}

/** category slug → distinct subcategory names (used for the header dropdown menus). */
export const getSubcategories = cache(async (): Promise<Record<string, string[]>> => {
  try {
    const rows = await (await coll("products")).aggregate([{ $match: { active: true, subcategory: { $nin: ["", null] } } }, { $group: { _id: { c: "$category", s: "$subcategory" } } }, { $sort: { "_id.s": 1 } }]).toArray();
    const out: Record<string, string[]> = {};
    for (const r of rows as any[]) (out[r._id.c] ||= []).length < 10 && out[r._id.c].push(r._id.s);
    return out;
  } catch { return {}; }
});

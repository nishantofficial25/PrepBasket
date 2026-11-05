import Fuse from "fuse.js";
import { list, Product } from "./db";
import { getExams } from "./exams";
import { getCategories, getProviders } from "./catalog";

export async function fuzzy(q: string, limit = 48): Promise<Product[]> {
  const [ps, ex, cats, provs] = await Promise.all([list({ active: true }, { limit: 3000 }), getExams(), getCategories(), getProviders()]);
  const exName = Object.fromEntries(ex.map(e => [e.slug, e.name]));
  const catName = Object.fromEntries(cats.map(c => [c.slug, c.name]));
  const provName = Object.fromEntries(provs.map(p => [p.slug, p.name]));
  const docs = ps.map(p => ({ p, examNames: (p.exams || []).map(s => exName[s] || s).join(" "), cat: catName[p.category] || "", store: provName[p.provider || ""] || "" }));
  const f = new Fuse(docs, {
    keys: [{ name: "p.name", weight: 3 }, { name: "examNames", weight: 2 }, { name: "p.subcategory", weight: 1.5 }, { name: "cat", weight: 1.5 }, { name: "store", weight: 1 }, { name: "p.description", weight: 0.6 }],
    threshold: 0.38, ignoreLocation: true, minMatchCharLength: 2,
  });
  return f.search(q.slice(0, 80), { limit }).map(r => r.item.p);
}

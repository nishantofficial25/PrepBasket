import { list } from "@/lib/db";
import { getCategories } from "@/lib/catalog";
import { getExams } from "@/lib/exams";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  const s = process.env.NEXT_PUBLIC_SITE_URL || "", [ps, ex, cats] = await Promise.all([list({ active: true }, { limit: 5000 }), getExams(), getCategories()]);
  const st = ["", "/products", "/categories", "/exams", "/guides", "/about", "/contact", "/affiliate-disclosure", "/privacy-policy", "/terms-and-conditions", "/disclaimer", "/editorial-policy", "/cookie-policy"];
  return [...st.map(u => ({ url: s + u })), ...cats.map(c => ({ url: `${s}/category/${c.slug}` })), ...ex.map(e => ({ url: `${s}/exam/${e.slug}` })), ...ps.map(p => ({ url: `${s}/product/${p.slug}` }))];
}

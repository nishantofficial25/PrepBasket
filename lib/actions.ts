"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { col, coll, ObjectId } from "./db";
import { DEFAULT_EXAMS } from "./exams";
import { DEFAULT_CATEGORIES, DEFAULT_PROVIDERS, getCategories, getProviders, detectProvider, slugify } from "./catalog";
import { ICON_KEYS } from "@/components/icons";
import { requireAdmin, startSession } from "./auth";
import { getPreview } from "./preview";
import { saveWebp, importRemoteImage, removeLocalImage, MAX_UPLOAD } from "./images";
import { PLACEMENTS } from "./banners";

const refresh = () => revalidatePath("/", "layout");
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (v: any) => (v === "" || v == null ? null : Number(v));

/* ---------- auth (with a small in-memory brute-force throttle) ---------- */
const fails = new Map<string, { n: number; t: number }>();
export async function login(_: any, f: FormData) {
  const ip = (headers().get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const rec = fails.get(ip);
  if (rec && Date.now() - rec.t < 15 * 60_000 && rec.n >= 5) return "Too many attempts. Try again in 15 minutes.";
  const ok = str(f, "email").toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase() && process.env.ADMIN_PASSWORD_HASH && await bcrypt.compare(String(f.get("password")), process.env.ADMIN_PASSWORD_HASH);
  if (!ok) { fails.set(ip, { n: (rec && Date.now() - rec.t < 15 * 60_000 ? rec.n : 0) + 1, t: Date.now() }); return "Wrong email or password."; }
  fails.delete(ip);
  await startSession(); redirect("/admin");
}
export async function logout() { (await import("next/headers")).cookies().delete("sb_admin"); redirect("/admin/login"); }

/* ---------- products ---------- */
export async function saveProduct(_: any, f: FormData) {
  await requireAdmin();
  const [cats, provs] = await Promise.all([getCategories(), getProviders()]);
  const c = await col(), id = str(f, "id");
  const existing: any = id ? await c.findOne({ _id: new ObjectId(id) }) : null;

  let url: URL;
  try { url = new URL(str(f, "affiliateUrl")); if (!/^https?:$/.test(url.protocol)) throw 0; } catch { return "Enter a valid product link starting with https://"; }

  // ----- image: uploaded file → WebP, else image URL (optionally copied locally as WebP)
  let image = str(f, "image"), name = str(f, "name");
  const file = f.get("file") as File | null;
  const wantCopy = f.get("localize") === "on";
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) return "Please choose an image file (JPG, PNG, WebP, AVIF…).";
    if (file.size > MAX_UPLOAD) return "Image is larger than 8 MB.";
    try { image = await saveWebp(Buffer.from(await file.arrayBuffer())); } catch { return "That image couldn't be read. Try a different file."; }
  } else {
    if (!image || !name) { const pv = await getPreview(url.toString()); image ||= pv?.image ?? ""; name ||= pv?.name ?? ""; }
    if (image && !image.startsWith("/uploads/")) {
      if (!/^https?:\/\//.test(image)) return "Image URL must start with https://";
      if (wantCopy) { try { image = await importRemoteImage(image); } catch { return "Couldn't download that image. Untick “Save a copy”, or upload the file instead."; } }
    }
  }

  const slug = slugify(str(f, "slug") || name);
  const category = str(f, "category");
  if (!name || !slug) return "Product name is required (or use a link we can read it from).";
  if (!cats.some(x => x.slug === category)) return "Choose a category. Add categories under Admin → Categories.";
  const provider = str(f, "provider") && provs.some(p => p.slug === str(f, "provider")) ? str(f, "provider") : detectProvider(url.hostname, provs);

  const featured = f.get("featured") === "on";
  const doc: any = {
    name, slug, description: str(f, "description"), image, category, subcategory: str(f, "subcategory"), brand: str(f, "brand"),
    exams: f.getAll("exams").map(String).filter(x => /^[a-z0-9-]+$/.test(x)),
    affiliateUrl: url.toString(), provider, price: num(f.get("price")), rating: num(f.get("rating")), reviewCount: num(f.get("reviewCount")),
    featured, active: f.get("active") === "on",
  };
  // New featured items go to the end of the featured list; un-featuring clears the position.
  if (featured) doc.featuredOrder = existing?.featuredOrder ?? Date.now(); else doc.featuredOrder = null;

  try { id ? await c.updateOne({ _id: new ObjectId(id) }, { $set: doc }) : await c.insertOne({ ...doc, createdAt: new Date() }); }
  catch { if (image !== existing?.image) await removeLocalImage(image); return "Could not save. Is the slug already used?"; }
  if (existing && existing.image !== image) await removeLocalImage(existing.image);
  refresh(); redirect("/admin");
}
export async function toggle(id: string, field: "featured" | "active", v: boolean) {
  await requireAdmin();
  const set: any = { [field]: v };
  if (field === "featured") set.featuredOrder = v ? Date.now() : null;
  await (await col()).updateOne({ _id: new ObjectId(id) }, { $set: set }); refresh();
}
export async function remove(id: string) {
  await requireAdmin();
  const c = await col(), d: any = await c.findOne({ _id: new ObjectId(id) });
  await c.deleteOne({ _id: new ObjectId(id) }); await removeLocalImage(d?.image); refresh();
}
export async function fetchPreview(url: string) { await requireAdmin(); return getPreview(url); }
export async function saveFeaturedOrder(ids: string[]) {
  await requireAdmin(); const c = await col();
  await Promise.all(ids.filter(i => /^[a-f0-9]{24}$/.test(i)).map((i, n) => c.updateOne({ _id: new ObjectId(i), featured: true }, { $set: { featuredOrder: n } })));
  refresh();
}

/* ---------- exams ---------- */
export async function addExam(f: FormData) { await requireAdmin(); const name = str(f, "name").slice(0, 60), slug = slugify(name); if (!slug) return; await (await coll("exams")).updateOne({ slug }, { $setOnInsert: { name, slug } }, { upsert: true }); refresh(); }
export async function seedExams() { await requireAdmin(); const c = await coll("exams"); for (const name of DEFAULT_EXAMS) await c.updateOne({ slug: slugify(name) }, { $setOnInsert: { name, slug: slugify(name) } }, { upsert: true }); refresh(); }
export async function deleteExam(id: string) { await requireAdmin(); const c = await coll("exams"), e = await c.findOne({ _id: new ObjectId(id) }); if (!e) return; await c.deleteOne({ _id: e._id }); await (await col()).updateMany({}, { $pull: { exams: e.slug } } as any); refresh(); }

/* ---------- categories ---------- */
async function nextOrder(name: string) { const last = await (await coll(name)).find().sort({ order: -1 }).limit(1).toArray(); return ((last[0] as any)?.order ?? -1) + 1; }
async function freeSlug(name: string, base: string) { const c = await coll(name); let s = base, i = 2; while (await c.findOne({ slug: s })) s = `${base}-${i++}`; return s; }
const icon = (v: string) => (ICON_KEYS.includes(v) ? v : "tag");

export async function addCategory(f: FormData) {
  await requireAdmin(); const name = str(f, "name").slice(0, 60); const base = slugify(name); if (!base) return;
  await (await coll("categories")).insertOne({ name, slug: await freeSlug("categories", base), icon: icon(str(f, "icon")), description: str(f, "description").slice(0, 200), order: await nextOrder("categories") }); refresh();
}
export async function updateCategory(id: string, f: FormData) {
  await requireAdmin(); const name = str(f, "name").slice(0, 60); if (!name) return;
  await (await coll("categories")).updateOne({ _id: new ObjectId(id) }, { $set: { name, icon: icon(str(f, "icon")), description: str(f, "description").slice(0, 200) } }); refresh(); // slug stays fixed so URLs and products never break
}
export async function deleteCategory(id: string): Promise<string | void> {
  await requireAdmin(); const c = await coll("categories"), cat: any = await c.findOne({ _id: new ObjectId(id) }); if (!cat) return;
  const n = await (await col()).countDocuments({ category: cat.slug });
  if (n) return `${n} product${n === 1 ? " uses" : "s use"} “${cat.name}”. Move ${n === 1 ? "it" : "them"} to another category first.`;
  await c.deleteOne({ _id: cat._id }); refresh();
}
export async function seedCategories() {
  await requireAdmin(); const c = await coll("categories"); let i = 0;
  for (const d of DEFAULT_CATEGORIES) await c.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, order: i++ } }, { upsert: true }); refresh();
}
export async function saveCategoryOrder(ids: string[]) {
  await requireAdmin(); const c = await coll("categories");
  await Promise.all(ids.filter(i => /^[a-f0-9]{24}$/.test(i)).map((i, n) => c.updateOne({ _id: new ObjectId(i) }, { $set: { order: n } }))); refresh();
}

/* ---------- stores / providers ---------- */
const domains = (s: string) => [...new Set(s.split(/[\s,]+/).map(d => d.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "")).filter(Boolean))].slice(0, 20);
export async function addProvider(f: FormData) {
  await requireAdmin(); const name = str(f, "name").slice(0, 40); const base = slugify(name); if (!base) return;
  await (await coll("providers")).insertOne({ name, slug: await freeSlug("providers", base), domains: domains(str(f, "domains")), order: await nextOrder("providers") }); refresh();
}
export async function updateProvider(id: string, f: FormData) {
  await requireAdmin(); const name = str(f, "name").slice(0, 40); if (!name) return;
  await (await coll("providers")).updateOne({ _id: new ObjectId(id) }, { $set: { name, domains: domains(str(f, "domains")) } }); refresh();
}
export async function deleteProvider(id: string): Promise<string | void> {
  await requireAdmin(); const c = await coll("providers"), p: any = await c.findOne({ _id: new ObjectId(id) }); if (!p) return;
  const n = await (await col()).countDocuments({ provider: p.slug });
  if (n) return `${n} product${n === 1 ? " is" : "s are"} linked to ${p.name}. Edit ${n === 1 ? "it" : "them"} first.`;
  await c.deleteOne({ _id: p._id }); refresh();
}
export async function seedProviders() {
  await requireAdmin(); const c = await coll("providers"); let i = 0;
  for (const d of DEFAULT_PROVIDERS) await c.updateOne({ slug: d.slug }, { $setOnInsert: { ...d, order: i++ } }, { upsert: true }); refresh();
}
export async function saveProviderOrder(ids: string[]) {
  await requireAdmin(); const c = await coll("providers");
  await Promise.all(ids.filter(i => /^[a-f0-9]{24}$/.test(i)).map((i, n) => c.updateOne({ _id: new ObjectId(i) }, { $set: { order: n } }))); refresh();
}

/* ---------- banners (home page hero, promo tiles, student-needs tiles) ---------- */
export async function saveBanner(f: FormData) {
  await requireAdmin();
  const c = await coll("banners"), id = str(f, "id"), existing: any = id && /^[a-f0-9]{24}$/.test(id) ? await c.findOne({ _id: new ObjectId(id) }) : null;
  const fail = (m: string) => redirect(`/admin/banners?err=${encodeURIComponent(m)}${id ? `&edit=${id}` : ""}`);
  const placement = str(f, "placement"), title = str(f, "title").slice(0, 80), href = str(f, "href");
  if (!PLACEMENTS.some(p => p.key === placement)) fail("Choose where the banner appears.");
  if (!title) fail("Title is required.");
  if (!/^(\/|https?:\/\/)/.test(href)) fail("Link must start with / (inside your site) or https://");
  let image = existing?.image || "";
  const file = f.get("file") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/") || file.size > MAX_UPLOAD) fail("Upload an image under 8 MB.");
    try { image = await saveWebp(Buffer.from(await file.arrayBuffer())); } catch { fail("That image couldn't be read."); }
  }
  const doc = { placement, badge: str(f, "badge").slice(0, 30), title, subtitle: str(f, "subtitle").slice(0, 200), buttonLabel: str(f, "buttonLabel").slice(0, 24), href, image, active: f.get("active") === "on" };
  if (existing) { await c.updateOne({ _id: existing._id }, { $set: doc }); if (existing.image !== image) await removeLocalImage(existing.image); }
  else await c.insertOne({ ...doc, order: await nextOrder("banners") });
  refresh(); redirect("/admin/banners");
}
export async function deleteBanner(id: string) { await requireAdmin(); const c = await coll("banners"), b: any = await c.findOne({ _id: new ObjectId(id) }); await c.deleteOne({ _id: new ObjectId(id) }); await removeLocalImage(b?.image); refresh(); }
export async function toggleBanner(id: string, v: boolean) { await requireAdmin(); await (await coll("banners")).updateOne({ _id: new ObjectId(id) }, { $set: { active: v } }); refresh(); }
export async function saveBannerOrder(ids: string[]) {
  await requireAdmin(); const c = await coll("banners");
  await Promise.all(ids.filter(i => /^[a-f0-9]{24}$/.test(i)).map((i, n) => c.updateOne({ _id: new ObjectId(i) }, { $set: { order: n } }))); refresh();
}

/* ---------- newsletter ---------- */
export async function subscribe(_: any, f: FormData): Promise<string> {
  if (str(f, "website")) return "Thanks for subscribing!"; // honeypot field: bots fill it, people never see it
  const email = str(f, "email").toLowerCase();
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Enter a valid email address.";
  try { await (await coll("subscribers")).updateOne({ email }, { $setOnInsert: { email, createdAt: new Date() } }, { upsert: true }); } catch { return "Couldn't subscribe right now. Please try again later."; }
  return "Thanks for subscribing!";
}
export async function deleteSubscriber(id: string) { await requireAdmin(); await (await coll("subscribers")).deleteOne({ _id: new ObjectId(id) }); }

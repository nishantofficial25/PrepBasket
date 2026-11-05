import { cache } from "react";
import { coll } from "./db";
export type Placement = "hero" | "promo" | "collection";
export const PLACEMENTS: { key: Placement; label: string; hint: string }[] = [
  { key: "hero", label: "Hero carousel", hint: "Large slides at the top of the home page. Best image: transparent PNG/WebP, about 900×700." },
  { key: "promo", label: "Promo tiles", hint: "Two side-by-side tiles under the trust strip." },
  { key: "collection", label: "Shop by student needs", hint: "Three small tiles with a title, subtitle and image." },
];
export type Banner = { id: string; placement: Placement; badge: string; title: string; subtitle: string; buttonLabel: string; href: string; image: string; order: number; active: boolean };
export const getBanners = cache(async (onlyActive = true): Promise<Banner[]> => {
  try {
    return (await (await coll("banners")).find(onlyActive ? { active: true } : {}).sort({ order: 1, _id: 1 }).toArray())
      .map((d: any) => ({ id: String(d._id), placement: d.placement, badge: d.badge || "", title: d.title, subtitle: d.subtitle || "", buttonLabel: d.buttonLabel || "", href: d.href || "/", image: d.image || "", order: d.order ?? 0, active: d.active !== false }));
  } catch { return []; }
});

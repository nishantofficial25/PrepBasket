"use client";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
/** Collapsible on phones, always open from lg up. */
export function FilterPanel({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div><button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="btn-ghost mb-3 w-full lg:hidden"><SlidersHorizontal size={16} />{open ? "Hide filters" : "Show filters"}</button><div className={`${open ? "block" : "hidden"} lg:block`}>{children}</div></div>;
}
/** Re-submits the filter form (via the `form` attribute) as soon as the sort changes. */
export function SortSelect({ form, value }: { form: string; value: string }) {
  return <select form={form} name="sort" defaultValue={value} aria-label="Sort by" onChange={e => e.currentTarget.form?.requestSubmit()} className="inp !w-auto"><option value="pop">Recommended</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>;
}

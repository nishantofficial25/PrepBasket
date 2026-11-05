import Link from "next/link";
export default function Pager({ page, total, per, base, params = {} }: { page: number; total: number; per: number; base: string; params?: Record<string, string | string[] | undefined> }) {
  const pages = Math.ceil(total / per); if (pages <= 1) return null;
  const href = (n: number) => { const q = new URLSearchParams(); for (const [k, v] of Object.entries(params)) for (const x of ([] as (string | undefined)[]).concat(v)) if (x) q.append(k, x); if (n > 1) q.set("page", String(n)); const s = q.toString(); return s ? `${base}?${s}` : base; };
  const nums = [...new Set([1, page - 1, page, page + 1, pages])].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);
  const cell = "grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-sm font-medium";
  return <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
    {page > 1 && <Link className={`${cell} border-line bg-white hover:border-brand`} href={href(page - 1)} rel="prev">‹ Prev</Link>}
    {nums.map((n, i) => <span key={n} className="flex items-center gap-2">{i > 0 && n - nums[i - 1] > 1 && <span className="text-muted">…</span>}<Link href={href(n)} aria-current={n === page ? "page" : undefined} className={`${cell} ${n === page ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand"}`}>{n}</Link></span>)}
    {page < pages && <Link className={`${cell} border-line bg-white hover:border-brand`} href={href(page + 1)} rel="next">Next ›</Link>}</nav>;
}

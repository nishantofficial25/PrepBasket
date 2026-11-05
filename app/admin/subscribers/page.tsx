import { requireAdmin } from "@/lib/auth";
import { coll } from "@/lib/db";
import { deleteSubscriber } from "@/lib/actions";
import Confirm from "@/components/Confirm";
export const dynamic = "force-dynamic";
export default async function Subs() {
  await requireAdmin(); let rows: any[] = [], total = 0;
  try { const c = await coll("subscribers"); [rows, total] = await Promise.all([c.find().sort({ _id: -1 }).limit(300).toArray(), c.countDocuments()]); } catch {}
  return <div className="wrap max-w-2xl space-y-5 py-8"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Newsletter subscribers</h1><p className="text-sm text-muted">{total} total{total > 300 ? " (showing latest 300; the CSV has all)" : ""}</p></div><a href="/admin/subscribers/csv" className="btn">Download CSV</a></div>
    {rows.length ? <ul className="panel divide-y divide-line">{rows.map(r => <li key={String(r._id)} className="flex items-center justify-between gap-3 p-3 text-sm"><span className="truncate">{r.email}</span><span className="flex shrink-0 items-center gap-4 text-xs text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : ""}<Confirm action={deleteSubscriber.bind(null, String(r._id))} msg={`Remove ${r.email}?`} className="text-sm font-semibold text-red-600">Remove</Confirm></span></li>)}</ul> : <p className="panel border-dashed p-8 text-center text-muted">No subscribers yet.</p>}</div>;
}

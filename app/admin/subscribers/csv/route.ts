import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { coll } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  await requireAdmin();
  const rows = await (await coll("subscribers")).find().sort({ _id: 1 }).toArray();
  const safe = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""'); // block spreadsheet formula injection
  const csv = "email,subscribed_at\n" + rows.map((r: any) => `"${safe(r.email)}","${r.createdAt ? new Date(r.createdAt).toISOString() : ""}"`).join("\n");
  return new NextResponse(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="subscribers.csv"' } });
}

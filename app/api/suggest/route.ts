import { NextRequest, NextResponse } from "next/server";
import { fuzzy } from "@/lib/search";
export async function GET(r: NextRequest) {
  const q = (r.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json([]);
  return NextResponse.json((await fuzzy(q, 6)).map(p => ({ name: p.name, slug: p.slug, image: p.image })));
}

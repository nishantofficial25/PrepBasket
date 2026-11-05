import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const done = new NextResponse(null, { status: 204 });
  if (!redis || !/^[a-f0-9]{24}$/.test(params.id) || /bot|crawl|spider|preview/i.test(req.headers.get("user-agent") || "")) return done;
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "x";
  try { if (await redis.set(`d:${params.id}:${ip}`, 1, { nx: true, ex: 600 })) { await redis.incr(`clicks:${params.id}`); await redis.incr("clicks:total"); } } catch {}
  return done;
}

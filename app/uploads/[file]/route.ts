import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { UPLOAD_DIR, FILE_RE } from "@/lib/images";

// Next.js only serves files that existed in /public at build time. Images uploaded later
// from the admin panel are served here, from the same URL (/uploads/<name>.webp).
export const dynamic = "force-dynamic";
export async function GET(_: NextRequest, { params }: { params: { file: string } }) {
  if (!FILE_RE.test(params.file)) return new NextResponse("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(UPLOAD_DIR, params.file));
    return new NextResponse(buf, { headers: { "content-type": "image/webp", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
  } catch { return new NextResponse("Not found", { status: 404 }); }
}

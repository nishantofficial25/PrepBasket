import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
export async function middleware(r: NextRequest) {
  if (r.nextUrl.pathname === "/admin/login") return NextResponse.next();
  try { await jwtVerify(r.cookies.get("sb_admin")?.value || "", new TextEncoder().encode(process.env.AUTH_SECRET || "")); return NextResponse.next(); }
  catch { return NextResponse.redirect(new URL("/admin/login", r.url)); }
}
export const config = { matcher: ["/admin/:path*"] };

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET || "");
export async function startSession() {
  const t = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("8h").sign(key());
  cookies().set("sb_admin", t, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 28800 });
}
export async function isAdmin() {
  const t = cookies().get("sb_admin")?.value;
  if (!t || !process.env.AUTH_SECRET) return false;
  try { await jwtVerify(t, key()); return true; } catch { return false; }
}
export async function requireAdmin() { if (!(await isAdmin())) redirect("/admin/login"); }

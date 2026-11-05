import { lookup } from "dns/promises";
import net from "net";

function isPrivateIp(ip: string) {
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7));
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

/** Throws unless the URL is http(s) and resolves only to public addresses (SSRF guard for admin-triggered fetches). */
export async function assertPublic(u: URL) {
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("bad protocol");
  if (net.isIP(u.hostname)) { if (isPrivateIp(u.hostname)) throw new Error("private address"); return; }
  const addrs = await lookup(u.hostname, { all: true });
  if (!addrs.length || addrs.some(a => isPrivateIp(a.address))) throw new Error("private address");
}

/** fetch() that re-validates every redirect hop. */
export async function safeFetch(url: string, init: RequestInit = {}, timeoutMs = 8000, hops = 4): Promise<Response> {
  let current = new URL(url);
  for (let i = 0; i <= hops; i++) {
    await assertPublic(current);
    const r = await fetch(current, { ...init, redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
    if (r.status >= 300 && r.status < 400 && r.headers.get("location")) { current = new URL(r.headers.get("location")!, current); continue; }
    return r;
  }
  throw new Error("too many redirects");
}

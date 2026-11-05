import { Redis } from "@upstash/redis";
const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
export const redis = url && token ? new Redis({ url, token }) : null;
export async function clicksFor(ids: string[]): Promise<Record<string, number>> {
  if (!redis || !ids.length) return {};
  try { const v = await redis.mget<(number | null)[]>(...ids.map(i => `clicks:${i}`)); return Object.fromEntries(ids.map((i, k) => [i, Number(v[k] || 0)])); } catch { return {}; }
}
export async function totalClicks() { try { return redis ? Number((await redis.get("clicks:total")) || 0) : 0; } catch { return 0; } }

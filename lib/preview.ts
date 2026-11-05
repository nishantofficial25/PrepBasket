import { safeFetch } from "./net";

/** Reads the Open Graph title + image from any public product page (Amazon, Flipkart, others). Some stores block bots; that just returns null. */
export async function getPreview(u: string): Promise<{ name: string; image: string } | null> {
  try {
    const r = await safeFetch(u, { headers: { "user-agent": "TelegramBot (like TwitterBot)", "accept-language": "en-IN" } });
    if (!r.ok) return null;
    const h = (await r.text()).slice(0, 300000);
    const m = (p: string) => {
      const a = h.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]*content=["']([^"']+)`, "i")) || h.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${p}["']`, "i"));
      return (a?.[1] ?? "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    };
    const image = m("og:image") || m("twitter:image");
    return { name: m("og:title"), image: image.startsWith("https://") ? image : "" };
  } catch { return null; }
}

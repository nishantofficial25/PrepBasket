import sharp from "sharp";
import { mkdir, writeFile, unlink } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
import { safeFetch } from "./net";

/** Where converted images live. Defaults to ./public/uploads; set UPLOAD_DIR to a mounted persistent disk in production. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
export const MAX_UPLOAD = 8 * 1024 * 1024;
export const FILE_RE = /^[a-z0-9-]+\.webp$/;

/** Converts any image buffer to an optimised WebP (max 1200px, EXIF-rotated, metadata stripped) and returns its public URL. */
export async function saveWebp(input: Buffer): Promise<string> {
  const out = await sharp(input, { limitInputPixels: 50_000_000 })
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const name = `${Date.now().toString(36)}-${randomBytes(5).toString("hex")}.webp`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), out);
  return `/uploads/${name}`;
}

/** Downloads a remote image and stores a WebP copy locally. */
export async function importRemoteImage(url: string): Promise<string> {
  const r = await safeFetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; StudyBasketBot/1.0)" } }, 10000);
  if (!r.ok || !(r.headers.get("content-type") || "").startsWith("image/")) throw new Error("not an image");
  const len = Number(r.headers.get("content-length") || 0);
  if (len > MAX_UPLOAD) throw new Error("too large");
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > MAX_UPLOAD) throw new Error("too large");
  return saveWebp(buf);
}

/** Deletes a locally stored image (no-op for external URLs). */
export async function removeLocalImage(url?: string | null) {
  const m = url?.match(/^\/uploads\/([a-z0-9-]+\.webp)$/);
  if (m) await unlink(path.join(UPLOAD_DIR, m[1])).catch(() => {});
}

# PrepBasket

Next.js 14 + MongoDB affiliate catalogue. Works with any store (Amazon, Flipkart, Meesho, your own).

## Run locally

1. `cp .env.example .env.local` and fill it in
2. `npm i && npm run dev`
3. Sign in at `/admin/login`, then in this order: **Categories** → **Stores** → **Exams** (each has a "Load starter…" button) → **Add product**

## Admin

- **Banners**: the home page carousel, two promo tiles and the three "Shop by student needs" tiles. Upload an image (auto WebP), set title, button and link, reorder, hide or edit. No banners = the home page starts straight with products.
- **Subscribers**: newsletter emails from the footer form, with CSV download.
- **Products**: paste any store link; name/image are fetched when the store allows it; the store is auto-detected from the domain.
- **Featured order**: drag or use arrows, then _Save order_. This is the order of "Featured picks" on the home page.
- **Categories**: add, rename, re-icon, delete (blocked while products use it), reorder. Order drives the menu and home page.
- **Stores**: add any store with its domains; the name shows on cards and buttons.

## Images

Uploaded images are converted to WebP (max 1200 px) with `sharp` and saved to `UPLOAD_DIR` (default `public/uploads`), served at `/uploads/<name>.webp`. Deleting a product, or replacing its image, removes the old file. Linked images can optionally be copied and converted too.

**Important:** files are written to disk, so host on a server that has a persistent disk (VPS, Docker volume, Railway/Render/Fly volume). Serverless hosts such as Vercel have a read-only, temporary filesystem and will lose uploads.

## Deploy with Docker

```
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com -t studybasket .
docker run -d --env-file .env -p 3000:3000 -v studybasket_uploads:/data/uploads studybasket
```

Put Nginx/Caddy in front for HTTPS. Without Docker: `npm run build && npm start`, and set `UPLOAD_DIR` to a folder that survives redeploys (otherwise back up `public/uploads`).

Clicks: each IP is counted once per product per 10 minutes via Upstash Redis (optional); shown in `/admin`.

## Customising

- Top bar text and footer disclosure: `lib/site.ts`. Footer social icons: `NEXT_PUBLIC_*_URL` env vars.
- Colours: `tailwind.config.js` (`brand`, `forest`, `sand`). Font: `app/layout.tsx`.
- Wishlist is stored in the visitor's browser (no accounts). There is deliberately no cart or sign-in: purchases happen on the store's own site.
- Product fields used by the filters: _Type/subcategory_, _Brand_, _Price_, _Rating_.

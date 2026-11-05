import Link from "next/link";
import { ImageOff, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/db";
import ClickLink from "./ClickLink";
import { WishButton } from "./wish";

// Presentational card (also used for the live preview in the admin form).
export default function Card({
  p,
  store,
  cat,
  preview,
}: {
  p: Product;
  store?: string;
  cat?: string;
  preview?: boolean;
}) {
  const href = preview ? "#" : `${p.affiliateUrl}`;
  return (
    <article className="group flex flex-col rounded-xl border border-line bg-white p-3 transition-shadow hover:shadow-pop">
      <div className="relative">
        <Link
          href={href}
          className="block aspect-square overflow-hidden rounded-lg bg-tint"
        >
          {p.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */ <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <span className="grid h-full place-items-center text-slate-300">
              <ImageOff size={32} />
            </span>
          )}
        </Link>
        {!preview && p.id && (
          <WishButton id={p.id} className="absolute right-2 top-2" />
        )}
        {/* {cat && (
          <span className="absolute bottom-2 left-2 rounded bg-forest/90 px-2 py-0.5 text-[11px] font-medium text-white">
            {cat}
          </span>
        )} */}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug">
          <Link href={href} className="hover:text-brand">
            {p.name}
          </Link>
        </h3>
        {p.description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted">
            {p.description}
          </p>
        )}
        {p.rating && p.reviewCount ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Star
              size={13}
              className="fill-amber-500 text-amber-500"
              aria-hidden
            />
            {p.rating}
            <span>({p.reviewCount.toLocaleString("en-IN")})</span>
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            {p.price ? (
              <p className="text-lg font-bold leading-none">
                ₹{p.price.toLocaleString("en-IN")}
              </p>
            ) : (
              <p className="text-xs text-muted">Check price</p>
            )}
            {store && (
              <p className="mt-1 truncate text-[11px] text-muted">on {store}</p>
            )}
          </div>
          <ClickLink
            id={preview ? undefined : p.id}
            href={p.affiliateUrl}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white transition-colors hover:bg-brand-600"
          >
            <ShoppingCart size={17} aria-hidden />
            <span className="sr-only">
              {store ? `View on ${store}` : "View product"} (opens in a new tab)
            </span>
          </ClickLink>
        </div>
      </div>
    </article>
  );
}
export const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-muted">
    {children}
  </p>
);

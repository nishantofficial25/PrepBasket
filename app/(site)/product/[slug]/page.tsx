import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ShieldCheck, Star } from "lucide-react";
import { bySlug, list } from "@/lib/db";
import { getCategories, getProviders } from "@/lib/catalog";
import { getExams } from "@/lib/exams";
import ProductGrid from "@/components/ProductGrid";
import ClickLink from "@/components/ClickLink";
export async function generateMetadata({ params }: any) {
  const p = await bySlug(params.slug);
  return p
    ? {
        title: p.name,
        description: p.description.slice(0, 155),
        alternates: { canonical: `/product/${p.slug}` },
        openGraph: { images: p.image ? [p.image] : [] },
      }
    : {};
}
export default async function Prod({ params }: any) {
  const p = await bySlug(params.slug);
  if (!p) notFound();
  const [exams, cats, provs, rel] = await Promise.all([
    getExams(),
    getCategories(),
    getProviders(),
    list(
      { active: true, category: p.category, slug: { $ne: p.slug } },
      { limit: 5 },
    ),
  ]);
  const cat = cats.find((c) => c.slug === p.category),
    store = provs.find((s) => s.slug === p.provider)?.name,
    my = exams.filter((e) => p.exams?.includes(e.slug));
  return (
    <div className="wrap py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        {cat && (
          <>
            {" "}
            /{" "}
            <Link href={`/category/${cat.slug}`} className="hover:text-brand">
              {cat.name}
            </Link>
          </>
        )}
      </nav>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <div className="grid aspect-square place-items-center rounded-2xl border border-line bg-tint p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>
        <div>
          {(store || p.subcategory || p.brand) && (
            <p className="text-sm text-muted">
              {[p.brand, store && `Sold on ${store}`, p.subcategory]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {p.name}
          </h1>
          {p.rating && p.reviewCount ? (
            <p className="mt-2 flex items-center gap-1 text-sm text-muted">
              <Star size={15} className="fill-amber-500 text-amber-500" />
              {p.rating} · {p.reviewCount.toLocaleString("en-IN")} reviews
              {store ? ` on ${store}` : ""}
            </p>
          ) : null}
          {my.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {my.map((e) => (
                <Link key={e.slug} href={`/exam/${e.slug}`} className="chip">
                  {e.name}
                </Link>
              ))}
            </div>
          )}
          {p.price ? (
            <p className="mt-5 text-3xl font-bold">
              ₹{p.price.toLocaleString("en-IN")}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted">
            Price and availability are set by the store and may change.
          </p>
          <ClickLink
            id={p.id}
            href={p.affiliateUrl}
            className="btn mt-6 w-full !py-3 text-base sm:w-auto sm:min-w-64"
          >
            {store ? `Buy on ${store}` : "View product"}{" "}
            <ExternalLink size={18} />
          </ClickLink>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-700">
            {p.description}
          </p>
          <div className="mt-6 flex gap-3 rounded-lg border border-line bg-white p-4 text-sm text-slate-700">
            <ShieldCheck className="shrink-0 text-brand" size={20} />
            <p>
              <strong>Affiliate disclosure:</strong> This is an affiliate link.
              If you buy, we may earn a commission at no extra cost to you. You
              complete your purchase on the store’s own site; PrepBasket does
              not sell, stock or deliver products.
            </p>
          </div>
        </div>
      </div>
      {rel.length > 0 && (
        <section className="mt-12">
          <h2 className="h2 mb-4">You may also like</h2>
          <ProductGrid items={rel} />
        </section>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategories } from "@/lib/catalog";
import Listing from "@/components/Listing";
import CatIcon from "@/components/icons";
export async function generateMetadata({ params }: any) {
  const c = (await getCategories()).find((c) => c.slug === params.slug);
  return c
    ? {
        title: c.name,
        description:
          c.description || `Browse ${c.name} picks for students on PrepBasket.`,
        alternates: { canonical: `/category/${c.slug}` },
      }
    : {};
}
export default async function Cat({ params, searchParams }: any) {
  const c = (await getCategories()).find((c) => c.slug === params.slug);
  if (!c) notFound();
  return (
    <div className="wrap py-3 sm:py-7">
      <nav
        aria-label="Breadcrumb"
        className="mb-3 hidden lg:flex items-center gap-1 text-xs text-muted"
      >
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink">{c.name}</span>
      </nav>
      <div className="mb-6 flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-50 to-brand-100 px-6 py-6 max-lg:sr-only sm:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {c.name}
          </h1>
          {c.description && (
            <p className="mt-2 max-w-xl text-sm text-slate-700">
              {c.description}
            </p>
          )}
        </div>
        <span className="hidden h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/70 text-brand sm:grid">
          <CatIcon name={c.icon} size={40} />
        </span>
      </div>
      <Listing
        base={{ active: true, category: c.slug }}
        path={`/category/${c.slug}`}
        sp={searchParams}
      />
    </div>
  );
}

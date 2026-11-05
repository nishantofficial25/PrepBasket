import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  Sparkles,
  Store,
  ShieldCheck,
  LifeBuoy,
  Zap,
} from "lucide-react";
import { list, ObjectId, featuredSort } from "@/lib/db";
import { getCategories } from "@/lib/catalog";
import { getExams } from "@/lib/exams";
import { getBanners, type Banner } from "@/lib/banners";
import { Empty } from "@/components/Card";
import ProductGrid from "@/components/ProductGrid";
import SectionHead from "@/components/SectionHead";
import Carousel from "@/components/Carousel";

const TRUST = [
  [Store, "Trusted stores", "Amazon, Flipkart & more"],
  [ShieldCheck, "Secure checkout", "Pay on the store’s own site"],
  [BadgeCheck, "Handpicked", "Curated for students"],
  [Sparkles, "Student friendly", "Useful picks, fair prices"],
] as const;

const Img = ({ src, className }: { src: string; className: string }) =>
  src ? (
    /* eslint-disable-next-line @next/next/no-img-element */ <img
      src={src}
      alt=""
      loading="lazy"
      className={className}
    />
  ) : null;

function Promo({ b, i }: { b: Banner; i: number }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 overflow-hidden rounded-2xl p-6 sm:p-8 ${i % 2 ? "bg-sand" : "bg-brand-100"}`}
    >
      <div className="min-w-0">
        <h3 className="text-xl font-bold leading-tight sm:text-2xl">
          {b.title}
        </h3>
        {b.subtitle && (
          <p className="mt-2 max-w-xs text-sm text-slate-700">{b.subtitle}</p>
        )}
        {b.buttonLabel && (
          <Link href={b.href} className="btn mt-4">
            {b.buttonLabel} <ArrowRight size={15} />
          </Link>
        )}
      </div>
      <Img
        src={b.image}
        className="max-h-36 w-2/5 shrink-0 object-contain sm:max-h-40"
      />
    </div>
  );
}
function Need({ b, i }: { b: Banner; i: number }) {
  return (
    <Link
      href={b.href}
      className={`group flex items-center gap-4 rounded-2xl p-4 transition-shadow hover:shadow-pop ${i % 2 ? "bg-sand" : "bg-brand-100"}`}
    >
      <Img src={b.image} className="h-20 w-20 shrink-0 object-contain" />
      <span className="min-w-0 flex-1">
        <span className="block font-bold leading-snug">{b.title}</span>
        {b.subtitle && (
          <span className="mt-0.5 block text-xs text-slate-700">
            {b.subtitle}
          </span>
        )}
      </span>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-brand group-hover:text-white">
        <ArrowRight size={15} />
      </span>
    </Link>
  );
}

export default async function Home() {
  const [cats, exams, banners, feat] = await Promise.all([
    getCategories(),
    getExams(),
    getBanners(),
    list({ active: true, featured: true }, { limit: 8, sort: featuredSort }),
  ]);
  const featIds = feat.map((p) => new ObjectId(p.id));
  const [latest, ...rails] = await Promise.all([
    list({ active: true, _id: { $nin: featIds } }, { limit: 8 }),
    ...cats
      .slice(0, 6)
      .map((c) => list({ active: true, category: c.slug }, { limit: 4 })),
  ]);
  const hero = banners.filter((b) => b.placement === "hero"),
    promo = banners.filter((b) => b.placement === "promo").slice(0, 4),
    needs = banners.filter((b) => b.placement === "collection").slice(0, 6);
  return (
    <div className="wrap space-y-10 py-5 sm:py-7">
      {hero.length > 0 && <Carousel slides={hero} />}

      {promo.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          {promo.map((b, i) => (
            <Promo key={b.id} b={b} i={i} />
          ))}
        </section>
      )}
      {feat.length === 0 && latest.length === 0 && (
        <Empty>Products are on their way. Please check back soon.</Empty>
      )}
      {feat.length > 0 && (
        <section>
          <SectionHead
            title="Top Picks"
            icon={<Zap size={18} />}
            href="/products"
          />
          <ProductGrid items={feat} />
        </section>
      )}
      {needs.length > 0 && (
        <section>
          <SectionHead title="Shop by Student Needs" />
          <div className="grid gap-4 md:grid-cols-3">
            {needs.map((b, i) => (
              <Need key={b.id} b={b} i={i} />
            ))}
          </div>
        </section>
      )}
      {latest.length > 0 && (
        <section>
          <SectionHead
            title={feat.length ? "New Arrivals" : "Latest Products"}
            href="/products"
          />
          <ProductGrid items={latest} />
        </section>
      )}
      <section
        aria-label="Why PrepBasket"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {TRUST.map(([I, t, d]) => (
          <div key={t} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
              <I size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{t}</p>
              <p className="text-xs text-muted">{d}</p>
            </div>
          </div>
        ))}
      </section>
      {cats.slice(0, 6).map(
        (c, i) =>
          rails[i].length > 0 && (
            <section key={c.slug}>
              <SectionHead title={c.name} href={`/category/${c.slug}`} />
              <ProductGrid items={rails[i]} />
            </section>
          ),
      )}
      {exams.length > 0 && (
        <section className="rounded-2xl bg-tint p-5 sm:p-6">
          <SectionHead
            title="Shop by Exam"
            icon={<GraduationCap size={18} />}
            href="/exams"
            label="All exams"
          />
          <div className="flex flex-wrap gap-2">
            {exams.map((e) => (
              <Link key={e.slug} href={`/exam/${e.slug}`} className="chip">
                {e.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";
import { Youtube, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { getCategories } from "@/lib/catalog";
import { DISCLOSURE, SOCIALS } from "@/lib/site";
const ICONS: Record<string, any> = {
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};
const L = (h: string, n: string) => (
  <li key={h}>
    <Link
      href={h}
      className="text-slate-600 transition-colors hover:text-brand"
    >
      {n}
    </Link>
  </li>
);
const H = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-3 text-sm font-semibold text-ink">{children}</h3>
);
export default async function Footer() {
  const cats = await getCategories();
  return (
    <footer className="mt-14 border-t border-line bg-brand-50 text-sm">
      <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-slate-600">
            A student-first platform to discover useful stationery, books and
            study essentials from trusted stores. We don’t sell, stock or
            deliver products.
          </p>
          {SOCIALS.length > 0 && (
            <div className="flex gap-2">
              {SOCIALS.map((s) => {
                const I = ICONS[s.key];
                return (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand shadow-soft transition-colors hover:bg-brand hover:text-white"
                  >
                    <I size={17} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <H>Shop by Category</H>
          <ul className="space-y-2">
            {cats.map((c) => L(`/category/${c.slug}`, c.name))}
          </ul>
        </div>
        <div>
          <H>Useful Links</H>
          <ul className="space-y-2">
            {L("/guides", "Buying Guides")}
            {L("/about", "About Us")}
            {L("/contact", "Contact Us")}
            {L("/affiliate-disclosure", "Affiliate Disclosure")}
            {L("/editorial-policy", "Editorial Policy")}
          </ul>
        </div>
        <div>
          <H>Policies</H>
          <ul className="space-y-2">
            {L("/privacy-policy", "Privacy Policy")}
            {L("/terms-and-conditions", "Terms & Conditions")}
            {L("/disclaimer", "Disclaimer")}
            {L("/cookie-policy", "Cookie Policy")}
          </ul>
        </div>
        <div className="relative">
          <H>Stay in the Loop</H>
          <p className="text-slate-600">
            Get study tips, product picks and useful updates for students.
          </p>
          <Newsletter />
        </div>
      </div>
      <div className="border-t border-brand-200 py-5 pb-24 text-center text-xs text-slate-600 lg:pb-5">
        {DISCLOSURE} © {new Date().getFullYear()} PrepBasket by SahiPhoto
      </div>
    </footer>
  );
}

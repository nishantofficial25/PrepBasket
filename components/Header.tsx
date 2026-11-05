"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Menu,
  X,
  Home,
  LayoutGrid,
  GraduationCap,
  ChevronDown,
  Package,
  Heart,
  LayoutList,
  Megaphone,
  ShieldCheck,
  Search as SearchIcon,
} from "lucide-react";
import Logo from "./Logo";
import SearchBox from "./SearchBox";
import CatIcon from "./icons";
import { WishCount } from "./wish";
import { TOPBAR_LEFT, TOPBAR_RIGHT } from "@/lib/site";
type Cat = { name: string; slug: string; icon: string; description: string };
type Exam = { name: string; slug: string };
const Search = ({ autoFocus }: { autoFocus?: boolean }) => (
  <Suspense
    fallback={<div className="h-11 rounded-lg border border-line bg-white" />}
  >
    <SearchBox autoFocus={autoFocus} />
  </Suspense>
);
const panel =
  "absolute left-0 top-full z-50 hidden pt-1 group-focus-within:block group-hover:block";
const box = "rounded-xl border border-line bg-white p-2 shadow-pop";

export default function Header({
  exams,
  cats,
  subs,
}: {
  exams: Exam[];
  cats: Cat[];
  subs: Record<string, string[]>;
}) {
  const [menu, setMenu] = useState(false),
    [find, setFind] = useState(false),
    path = usePathname();
  useEffect(() => {
    setMenu(false);
    setFind(false);
  }, [path]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  const tabs = [
    ["/", "Home", Home],
    ["/products", "All items", Package],
    ["/exams", "Exam Store", GraduationCap],
  ] as const;
  const nav =
    "flex items-center gap-1 py-3 text-sm font-medium hover:text-brand";
  const shown = cats.slice(0, 6),
    more = cats.slice(6);
  return (
    <>
      <div className="bg-forest text-[11px] text-white/90 sm:text-xs">
        <div className="wrap flex items-center justify-between gap-4 py-1.5">
          <p className="flex items-center gap-2 truncate">
            <Megaphone size={13} className="shrink-0" />
            {TOPBAR_LEFT}
          </p>
          <p className="hidden shrink-0 items-center gap-2 sm:flex">
            <ShieldCheck size={13} />
            {TOPBAR_RIGHT}
          </p>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="wrap flex h-16 items-center gap-3 lg:h-[72px] lg:gap-6">
          <button
            aria-label="Open menu"
            className="-ml-2 p-2 lg:hidden"
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
          <Logo />
          <div className="group relative hidden lg:block">
            <button className="flex h-11 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-600">
              <LayoutList size={16} />
              All Categories
              <ChevronDown size={14} />
            </button>
            <div className={panel}>
              <div className={`${box} grid w-[560px] grid-cols-2 gap-1`}>
                {cats.length ? (
                  cats.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                        <CatIcon name={c.icon} size={18} />
                      </span>
                      <span className="text-sm font-medium">{c.name}</span>
                    </Link>
                  ))
                ) : (
                  <span className="col-span-2 p-3 text-sm text-muted">
                    Categories coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden flex-1 lg:block">
            <Search />
          </div>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button
              aria-label={find ? "Close search" : "Search"}
              aria-expanded={find}
              onClick={() => setFind((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-brand-50 hover:text-brand lg:hidden"
            >
              {find ? <X size={22} /> : <SearchIcon size={22} />}
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-brand-50 hover:text-brand"
            >
              <Heart size={22} />
              <WishCount />
            </Link>
          </div>
        </div>
        {find && (
          <div className="wrap pb-2.5 lg:hidden">
            <Search autoFocus />
          </div>
        )}
      </header>
      <div className="hidden border-b border-line bg-white lg:block">
        <nav aria-label="Main" className="wrap flex items-center gap-7">
          {shown.map((c) => (
            <div key={c.slug} className="group relative">
              <Link href={`/category/${c.slug}`} className={nav}>
                {c.name}
                {subs[c.slug]?.length ? <ChevronDown size={13} /> : null}
              </Link>
              {subs[c.slug]?.length ? (
                <div className={panel}>
                  <div className={`${box} min-w-52`}>
                    {subs[c.slug].map((s) => (
                      <Link
                        key={s}
                        href={`/category/${c.slug}?sub=${encodeURIComponent(s)}`}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand"
                      >
                        {s}
                      </Link>
                    ))}
                    <Link
                      href={`/category/${c.slug}`}
                      className="mt-1 block border-t border-line px-3 pb-1 pt-2 text-sm font-semibold text-brand"
                    >
                      View all
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          {more.length > 0 && (
            <div className="group relative">
              <button className={nav}>
                More <ChevronDown size={13} />
              </button>
              <div className={panel}>
                <div className={`${box} min-w-52`}>
                  {more.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/category/${c.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {exams.length > 0 && (
            <div className="group relative">
              <Link href="/exams" className={nav}>
                Exam Stores <ChevronDown size={13} />
              </Link>
              <div className={panel}>
                <div className={`${box} grid w-72 grid-cols-2 gap-1`}>
                  {exams.map((e) => (
                    <Link
                      key={e.slug}
                      href={`/exam/${e.slug}`}
                      className="rounded-lg px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand"
                    >
                      {e.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* <Link href="/guides" className={nav}>
            Buying Guides
          </Link> */}
        </nav>
      </div>
      <div className="border-b border-line bg-white lg:hidden">
        <div className="wrap no-scrollbar flex gap-2 overflow-x-auto py-2.5">
          <Link
            href="/products"
            className={`chip ${path === "/" || path === "/products" ? "chip-on" : ""}`}
          >
            All
          </Link>
          {cats.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              aria-current={path === `/category/${c.slug}` ? "page" : undefined}
              className={`chip ${path === `/category/${c.slug}` ? "chip-on" : ""}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMenu(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-xs overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <Logo />
              <button aria-label="Close menu" onClick={() => setMenu(false)}>
                <X />
              </button>
            </div>
            <p className="mb-1 text-xs font-semibold text-muted">Categories</p>
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 font-medium hover:bg-brand-50"
              >
                <span className="text-brand">
                  <CatIcon name={c.icon} size={18} />
                </span>
                {c.name}
              </Link>
            ))}
            {exams.length > 0 && (
              <>
                <p className="mb-2 mt-5 text-xs font-semibold text-muted">
                  Exam stores
                </p>
                <div className="flex flex-wrap gap-2">
                  {exams.map((e) => (
                    <Link
                      key={e.slug}
                      href={`/exam/${e.slug}`}
                      className="chip"
                    >
                      {e.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
            {/* <Link
              href="/guides"
              className="mt-5 block rounded-lg px-2 py-2.5 font-medium hover:bg-brand-50"
            >
              Buying Guides
            </Link> */}
          </aside>
        </div>
      )}
      <nav
        aria-label="Quick"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {tabs.map(([h, l, I]) => {
          const on = h === "/" ? path === "/" : path.startsWith(h);
          return (
            <Link
              key={h}
              href={h}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${on ? "text-brand" : "text-muted"}`}
            >
              <I size={20} />
              {l}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/banners";
export default function Carousel({ slides }: { slides: Banner[] }) {
  const [i, setI] = useState(0), [pause, setPause] = useState(false), n = slides.length;
  useEffect(() => { if (n < 2 || pause || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const t = setInterval(() => setI(x => (x + 1) % n), 6000); return () => clearInterval(t); }, [n, pause]);
  const go = (d: number) => setI(x => (x + d + n) % n);
  const arrow = "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow-pop transition-colors hover:text-brand sm:grid";
  return (
    <section aria-roledescription="carousel" aria-label="Featured offers" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-[#E8F3E0] to-brand-100" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)} onFocus={() => setPause(true)} onBlur={() => setPause(false)}>
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div key={s.id} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== i} className="grid min-w-full items-center gap-4 px-6 py-7 sm:px-14 md:grid-cols-2 md:py-9">
            <div>
              {s.badge && <span className="inline-block rounded-md bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">{s.badge}</span>}
              <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">{s.title}</h2>
              {s.subtitle && <p className="mt-3 max-w-md text-sm text-slate-700 sm:text-base">{s.subtitle}</p>}
              {s.buttonLabel && <Link href={s.href} tabIndex={k === i ? 0 : -1} className="btn mt-5 !px-5 !py-3">{s.buttonLabel} <ArrowRight size={16} /></Link>}
            </div>
            {s.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.image} alt="" loading={k === 0 ? "eager" : "lazy"} className="mx-auto max-h-56 w-full object-contain sm:max-h-72" />}
          </div>))}
      </div>
      {n > 1 && <>
        <button aria-label="Previous slide" onClick={() => go(-1)} className={`${arrow} left-3`}><ChevronLeft size={20} /></button>
        <button aria-label="Next slide" onClick={() => go(1)} className={`${arrow} right-3`}><ChevronRight size={20} /></button>
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">{slides.map((s, k) => <button key={s.id} aria-label={`Go to slide ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? "w-5 bg-brand" : "w-2 bg-brand/30"}`} />)}</div></>}
    </section>);
}

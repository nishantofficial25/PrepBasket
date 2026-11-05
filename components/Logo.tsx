import Link from "next/link";
export default function Logo({ light }: { light?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="PrepBasket home"
      className="inline-flex items-center gap-2.5"
    >
      {/* <svg viewBox="0 0 32 32" width="38" height="38" aria-hidden>
        <path d="M16 3 4 9.5v13L16 29V16z" fill="#2D7A3E" />
        <path
          d="M16 3l12 6.5v13L16 29V16z"
          fill={light ? "#9AD38B" : "#1B4A31"}
        />
        <path d="M4 9.5 16 16l12-6.5L16 3z" fill="#7DBF6B" />
      </svg> */}
      <span className="flex flex-col leading-none">
        <span
          className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}
        >
          PrepBasket
        </span>
        <span
          className={`mt-1 text-[11px] font-medium ${light ? "text-slate-300" : "text-muted"}`}
        >
          by SahiPhoto
        </span>
      </span>
    </Link>
  );
}

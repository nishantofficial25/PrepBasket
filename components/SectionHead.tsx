import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function SectionHead({ title, href, label = "View All", icon }: { title: string; href?: string; label?: string; icon?: React.ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-4"><h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight sm:text-2xl">{icon && <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand">{icon}</span>}{title}</h2>{href && <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">{label}<ArrowRight size={15} /></Link>}</div>;
}

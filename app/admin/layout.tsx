import Link from "next/link";
import Logo from "@/components/Logo";
import { isAdmin } from "@/lib/auth";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin();
  const nav = [["/admin", "Products"], ["/admin/featured", "Featured order"], ["/admin/categories", "Categories"], ["/admin/providers", "Stores"], ["/admin/banners", "Banners"], ["/admin/exams", "Exams"], ["/admin/subscribers", "Subscribers"]];
  return <div className="min-h-screen pb-16"><header className="border-b border-line bg-white"><div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 py-3"><Logo /><span className="rounded bg-ink px-2 py-0.5 text-xs font-semibold text-white">Admin</span>
    {ok && <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">{nav.map(([h, l]) => <Link key={h} href={h} className="hover:text-brand">{l}</Link>)}</nav>}<Link href="/" className="ml-auto text-sm text-muted hover:text-brand">View site →</Link></div></header>{children}</div>;
}

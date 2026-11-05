import { notFound } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { list } from "@/lib/db";
import { getExams } from "@/lib/exams";
import { Empty } from "@/components/Card";
import ProductGrid from "@/components/ProductGrid";
export async function generateMetadata({ params }: any) { const e = (await getExams()).find(e => e.slug === params.slug); return e ? { title: `${e.name} Study Material`, description: `Books and study material for ${e.name} aspirants.`, alternates: { canonical: `/exam/${e.slug}` } } : {}; }
export default async function ExamPage({ params }: any) {
  const e = (await getExams()).find(e => e.slug === params.slug); if (!e) notFound();
  const items = await list({ active: true, exams: e.slug }, { limit: 96 });
  return <div className="wrap py-6 sm:py-8"><div className="mb-5 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white"><GraduationCap size={22} /></span><div><h1 className="text-2xl font-bold tracking-tight">{e.name} store</h1><p className="text-sm text-muted">{items.length} item{items.length === 1 ? "" : "s"} for {e.name} preparation</p></div></div>
    {items.length ? <ProductGrid items={items} /> : <Empty>No products for {e.name} yet.</Empty>}</div>;
}

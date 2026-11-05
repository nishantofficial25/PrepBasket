import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getExams } from "@/lib/exams";
import { Empty } from "@/components/Card";
export const metadata = { title: "Exam Stores", alternates: { canonical: "/exams" } };
export default async function Exams() {
  const exams = await getExams();
  return <div className="wrap py-6 sm:py-8"><h1 className="text-2xl font-bold tracking-tight">Exam stores</h1><p className="mt-1 text-sm text-muted">Pick your exam to see study material gathered for it.</p>
    <div className="mt-6">{exams.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">{exams.map(e => <Link key={e.slug} href={`/exam/${e.slug}`} className="panel flex items-center gap-3 p-4 transition-colors hover:border-brand"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-50 text-brand"><GraduationCap size={20} /></span><span className="font-semibold">{e.name}</span></Link>)}</div> : <Empty>No exam stores yet.</Empty>}</div></div>;
}

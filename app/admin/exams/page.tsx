import { requireAdmin } from "@/lib/auth";
import { getExams } from "@/lib/exams";
import { addExam, deleteExam, seedExams } from "@/lib/actions";
import Confirm from "@/components/Confirm";
export const dynamic = "force-dynamic";
export default async function Exams() {
  await requireAdmin(); const exams = await getExams();
  return <div className="wrap max-w-2xl space-y-6 py-8"><h1 className="text-2xl font-bold">Exam stores</h1>
    <form action={addExam} className="flex gap-2"><input name="name" required placeholder="Exam name, e.g. SSC CGL" className="inp" /><button className="btn">Add</button></form>
    {exams.length ? <ul className="panel divide-y divide-line">{exams.map(e => <li key={e.id} className="flex items-center justify-between p-3"><span><strong>{e.name}</strong> <span className="text-xs text-muted">/exam/{e.slug}</span></span><Confirm action={deleteExam.bind(null, e.id)} msg={`Delete ${e.name}? It will be removed from all products.`} className="text-sm font-semibold text-red-600">Delete</Confirm></li>)}</ul>
      : <div className="panel border-dashed p-8 text-center"><p className="mb-4">No exams yet.</p><form action={seedExams}><button className="btn-ghost">Load common exam names (SSC, UPSC, NEET…)</button></form></div>}</div>;
}

import { requireAdmin } from "@/lib/auth";
import { col, ObjectId } from "@/lib/db";
import Form from "./Form";
import { getExams } from "@/lib/exams";
import { getCategories, getProviders } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function P({ searchParams }: any) {
  await requireAdmin(); let p: any = null;
  if (searchParams.id && /^[a-f0-9]{24}$/.test(searchParams.id)) { const d = await (await col()).findOne({ _id: new ObjectId(searchParams.id) }); if (d) p = { ...d, id: String(d._id), _id: undefined, createdAt: undefined }; }
  const [exams, cats, provs] = await Promise.all([getExams(), getCategories(), getProviders()]);
  return <Form p={p} exams={exams} cats={cats} provs={provs} />;
}

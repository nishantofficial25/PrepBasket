import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getExams } from "@/lib/exams";
import { getCategories, getSubcategories } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function Site({ children }: { children: React.ReactNode }) {
  const [exams, cats, subs] = await Promise.all([getExams(), getCategories(), getSubcategories()]);
  return <><Header exams={exams} cats={cats} subs={subs} /><main className="min-h-[60vh]">{children}</main><Footer /></>;
}

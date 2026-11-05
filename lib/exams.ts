import { cache } from "react";
import { coll } from "./db";
export { slugify } from "./catalog";
export type Exam = { id: string; name: string; slug: string };
export const DEFAULT_EXAMS = ["SSC", "UPSC", "NEET", "JEE", "Railways (RRB)", "Banking", "NDA", "CUET", "GATE", "CAT"];
export const getExams = cache(async (): Promise<Exam[]> => {
  try { return (await (await coll("exams")).find().sort({ name: 1 }).toArray()).map((d: any) => ({ id: String(d._id), name: d.name, slug: d.slug })); } catch { return []; }
});

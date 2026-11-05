import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/catalog";
import { addCategory, updateCategory, deleteCategory, seedCategories, saveCategoryOrder } from "@/lib/actions";
import { ICON_KEYS } from "@/components/icons";
import Confirm from "@/components/Confirm";
import SortList from "@/components/SortList";
export const dynamic = "force-dynamic";
const IconSelect = ({ def }: { def?: string }) => <select name="icon" defaultValue={def || "tag"} aria-label="Icon" className="inp !w-36">{ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}</select>;
export default async function Categories() {
  await requireAdmin(); const cats = await getCategories();
  return <div className="wrap max-w-3xl space-y-5 py-8"><div><h1 className="text-2xl font-bold">Categories</h1><p className="mt-1 text-sm text-muted">Create any category you like. The order here is the order in the site menu and on the home page. Renaming keeps the web address, so existing links keep working.</p></div>
    <form action={addCategory} className="flex flex-wrap gap-2"><input name="name" required maxLength={60} placeholder="New category, e.g. Art Supplies" className="inp !w-auto min-w-56 flex-1" /><IconSelect /><input name="description" maxLength={200} placeholder="Short description (optional, shown on the category page)" className="inp" /><button className="btn">Add category</button></form>
    {cats.length === 0 && <form action={seedCategories}><button className="btn-ghost">Load starter categories (Stationery, Books, Technology…)</button></form>}
    <SortList key={cats.map(c => c.id).join()} save={saveCategoryOrder} empty="No categories yet."
      items={cats.map(c => ({ id: c.id, title: c.name, sub: `/category/${c.slug}`, extra: <div className="flex flex-wrap items-center gap-2">
        <form action={updateCategory.bind(null, c.id)} className="flex items-center gap-2"><input name="name" defaultValue={c.name} required maxLength={60} aria-label="Name" className="inp !w-40" /><IconSelect def={c.icon} /><input name="description" defaultValue={c.description} maxLength={200} placeholder="Description" aria-label="Description" className="inp !w-56" /><button className="btn-ghost !py-2">Save</button></form>
        <Confirm action={deleteCategory.bind(null, c.id)} msg={`Delete “${c.name}”?`} className="text-sm font-semibold text-red-600">Delete</Confirm></div> }))} /></div>;
}

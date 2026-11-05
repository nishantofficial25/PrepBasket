import { requireAdmin } from "@/lib/auth";
import { getProviders } from "@/lib/catalog";
import { addProvider, updateProvider, deleteProvider, seedProviders, saveProviderOrder } from "@/lib/actions";
import Confirm from "@/components/Confirm";
import SortList from "@/components/SortList";
export const dynamic = "force-dynamic";
export default async function Providers() {
  await requireAdmin(); const provs = await getProviders();
  return <div className="wrap max-w-3xl space-y-5 py-8"><div><h1 className="text-2xl font-bold">Stores</h1><p className="mt-1 text-sm text-muted">Products can link to any store: Amazon, Flipkart, Meesho or your own. Add the store’s domains (comma separated) and links are matched automatically when you paste them. The store name appears on the product card and button.</p></div>
    <form action={addProvider} className="flex flex-wrap gap-2"><input name="name" required maxLength={40} placeholder="Store name, e.g. Myntra" className="inp !w-auto min-w-44 flex-1" /><input name="domains" placeholder="Domains, e.g. myntra.com, myntr.it" className="inp !w-auto min-w-56 flex-[2]" /><button className="btn">Add store</button></form>
    {provs.length === 0 && <form action={seedProviders}><button className="btn-ghost">Load Amazon, Flipkart and Meesho</button></form>}
    <SortList key={provs.map(c => c.id).join()} save={saveProviderOrder} empty="No stores yet."
      items={provs.map(p => ({ id: p.id, title: p.name, sub: p.domains.join(", ") || "No domains (choose this store manually on each product)", extra: <div className="flex flex-wrap items-center gap-2">
        <form action={updateProvider.bind(null, p.id)} className="flex items-center gap-2"><input name="name" defaultValue={p.name} required maxLength={40} aria-label="Name" className="inp !w-32" /><input name="domains" defaultValue={p.domains.join(", ")} aria-label="Domains" className="inp !w-52" /><button className="btn-ghost !py-2">Save</button></form>
        <Confirm action={deleteProvider.bind(null, p.id)} msg={`Delete ${p.name}?`} className="text-sm font-semibold text-red-600">Delete</Confirm></div> }))} /></div>;
}

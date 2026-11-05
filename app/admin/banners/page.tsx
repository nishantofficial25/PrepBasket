import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getBanners, PLACEMENTS } from "@/lib/banners";
import { saveBanner, deleteBanner, toggleBanner, saveBannerOrder } from "@/lib/actions";
import Confirm from "@/components/Confirm";
import SortList from "@/components/SortList";
export const dynamic = "force-dynamic";
export default async function Banners({ searchParams }: any) {
  await requireAdmin();
  const all = await getBanners(false), edit = all.find(b => b.id === searchParams.edit);
  const lbl = "mb-1 block text-sm font-medium";
  return <div className="wrap max-w-3xl space-y-6 py-8"><div><h1 className="text-2xl font-bold">Home page banners</h1><p className="mt-1 text-sm text-muted">Control the carousel, promo tiles and “Shop by student needs” tiles on the home page. With no banners, the home page simply starts with products. Images are converted to WebP automatically.</p></div>
    <form action={saveBanner} className="panel space-y-3 p-5"><h2 className="font-semibold">{edit ? "Edit banner" : "Add banner"}</h2>{edit && <input type="hidden" name="id" value={edit.id} />}
      {searchParams.err && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{searchParams.err}</p>}
      <div className="grid gap-3 sm:grid-cols-2"><div><label className={lbl} htmlFor="placement">Where</label><select id="placement" name="placement" defaultValue={edit?.placement || "hero"} className="inp">{PLACEMENTS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}</select></div>
        <div><label className={lbl} htmlFor="badge">Small badge <span className="font-normal text-muted">(carousel only)</span></label><input id="badge" name="badge" maxLength={30} defaultValue={edit?.badge} placeholder="Student Special" className="inp" /></div></div>
      <div><label className={lbl} htmlFor="title">Title</label><input id="title" name="title" required maxLength={80} defaultValue={edit?.title} placeholder="Back to college essentials" className="inp" /></div>
      <div><label className={lbl} htmlFor="subtitle">Subtitle</label><input id="subtitle" name="subtitle" maxLength={200} defaultValue={edit?.subtitle} className="inp" /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div><label className={lbl} htmlFor="buttonLabel">Button text</label><input id="buttonLabel" name="buttonLabel" maxLength={24} defaultValue={edit?.buttonLabel} placeholder="Shop Now" className="inp" /></div>
        <div><label className={lbl} htmlFor="href">Link</label><input id="href" name="href" required defaultValue={edit?.href} placeholder="/category/stationery" className="inp" /></div></div>
      <div><label className={lbl} htmlFor="file">Image {edit?.image && <span className="font-normal text-muted">(leave empty to keep the current one)</span>}</label><input id="file" name="file" type="file" accept="image/*" className="inp" /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={edit ? edit.active : true} /> Visible on the site</label>
      <div className="flex gap-3"><button className="btn">{edit ? "Save changes" : "Add banner"}</button>{edit && <Link href="/admin/banners" className="btn-ghost">Cancel</Link>}</div></form>
    {PLACEMENTS.map(pl => { const rows = all.filter(b => b.placement === pl.key); return <section key={pl.key}><h2 className="font-semibold">{pl.label}</h2><p className="mb-3 text-xs text-muted">{pl.hint}</p>
      <SortList key={rows.map(b => b.id).join()} save={saveBannerOrder} empty="None yet."
        items={rows.map(b => ({ id: b.id, title: b.title, sub: `${b.active ? "Visible" : "Hidden"} · ${b.href}`, image: b.image, extra: <div className="flex items-center gap-3 text-sm font-semibold"><form action={toggleBanner.bind(null, b.id, !b.active)}><button className="text-muted hover:text-brand">{b.active ? "Hide" : "Show"}</button></form><Link href={`/admin/banners?edit=${b.id}`} className="text-brand">Edit</Link><Confirm action={deleteBanner.bind(null, b.id)} msg="Delete this banner?" className="text-red-600">Delete</Confirm></div> }))} /></section>; })}</div>;
}

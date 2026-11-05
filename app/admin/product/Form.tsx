"use client";
import { useFormState } from "react-dom";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveProduct, fetchPreview } from "@/lib/actions";
import Card from "@/components/Card";
type Opt = { name: string; slug: string };
export default function Form({
  p,
  exams,
  cats,
  provs,
}: {
  p: any;
  exams: Opt[];
  cats: Opt[];
  provs: Opt[];
}) {
  const [err, act] = useFormState(saveProduct, null as string | null);
  const [v, setV] = useState({
    category: p?.category ?? "",
    name: p?.name ?? "",
    image: p?.image ?? "",
    affiliateUrl: p?.affiliateUrl ?? "",
    price: p?.price ?? "",
    provider: p?.provider ?? "",
  });
  const [local, setLocal] = useState(""); // object URL of a freshly chosen file, for the live preview
  const [busy, go] = useTransition();
  const [note, setNote] = useState("");
  const pull = () =>
    go(async () => {
      const r = await fetchPreview(v.affiliateUrl);
      if (!r || (!r.image && !r.name))
        return setNote(
          "Couldn’t read that link (some stores block this). Enter the name and image manually.",
        );
      setV((x) => ({
        ...x,
        name: x.name || r.name,
        image: r.image || x.image,
      }));
      setNote("Fetched from the link. Check the name before saving.");
    });
  const on = (k: string) => (e: any) => setV({ ...v, [k]: e.target.value });
  const d = (k: string) => p?.[k] ?? "";
  const remote = v.image && !v.image.startsWith("/uploads/");
  const lbl = "mb-1 block text-sm font-medium";
  return (
    <div className="wrap grid max-w-5xl gap-6 py-8 md:grid-cols-[1fr_260px]">
      <form action={act} className="panel space-y-4 p-5">
        <h1 className="text-xl font-bold">{p ? "Edit" : "Add"} product</h1>
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <div>
          <label className={lbl} htmlFor="affiliateUrl">
            Product link
          </label>
          <input
            id="affiliateUrl"
            name="affiliateUrl"
            required
            placeholder="https://… (Amazon, Flipkart or any store)"
            value={v.affiliateUrl}
            onChange={on("affiliateUrl")}
            className="inp"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={pull}
              disabled={busy || !v.affiliateUrl}
              className="btn-ghost !py-1.5"
            >
              {busy ? "Fetching…" : "Fetch name & image from link"}
            </button>
            {note && <p className="text-sm text-muted">{note}</p>}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Auto-filled from the link if empty"
              value={v.name}
              onChange={on("name")}
              className="inp"
            />
          </div>
          <div>
            <label className={lbl} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              placeholder="Auto from name"
              defaultValue={d("slug")}
              className="inp"
            />
          </div>
        </div>
        <div>
          <label className={lbl} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={d("description")}
            className="inp"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={lbl} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={v.category}
              onChange={on("category")}
              className="inp"
            >
              <option value="">Choose…</option>
              {cats.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {!cats.length && (
              <p className="mt-1 text-xs text-red-600">
                Add one under{" "}
                <Link href="/admin/categories" className="underline">
                  Categories
                </Link>{" "}
                first.
              </p>
            )}
          </div>
          <div>
            <label className={lbl} htmlFor="subcategory">
              Type / subcategory
            </label>
            <input
              id="subcategory"
              name="subcategory"
              placeholder="e.g. Pens"
              defaultValue={d("subcategory")}
              className="inp"
            />
          </div>
          <div>
            <label className={lbl} htmlFor="brand">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              placeholder="e.g. Classmate"
              defaultValue={d("brand")}
              className="inp"
            />
          </div>
          <div>
            <label className={lbl} htmlFor="provider">
              Store
            </label>
            <select
              id="provider"
              name="provider"
              value={v.provider}
              onChange={on("provider")}
              className="inp"
            >
              <option value="">Auto-detect from link</option>
              {provs.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <fieldset className="space-y-3 rounded-md border border-line p-3">
          <legend className="px-1 text-sm font-medium">Image</legend>
          <div>
            <label className={lbl} htmlFor="file">
              Upload a file{" "}
              <span className="font-normal text-muted">
                (converted to WebP and stored on your server)
              </span>
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setLocal(f ? URL.createObjectURL(f) : "");
              }}
              className="inp"
            />
          </div>
          <div>
            <label className={lbl} htmlFor="image">
              …or image URL
            </label>
            <input
              id="image"
              name="image"
              placeholder="https://… or leave empty"
              value={v.image}
              onChange={on("image")}
              className="inp"
            />
          </div>
          {remote && (
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="localize" className="mt-0.5" />
              <span>
                Save a WebP copy of this linked image on my server{" "}
                <span className="text-muted">
                  (only for images you have the right to use)
                </span>
              </span>
            </label>
          )}
        </fieldset>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={lbl} htmlFor="price">
              Price ₹
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={v.price}
              onChange={on("price")}
              className="inp"
            />
          </div>
          <div>
            <label className={lbl} htmlFor="rating">
              Rating
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              step="0.1"
              max="5"
              defaultValue={d("rating")}
              className="inp"
            />
          </div>
          <div>
            <label className={lbl} htmlFor="reviewCount">
              Reviews
            </label>
            <input
              id="reviewCount"
              name="reviewCount"
              type="number"
              defaultValue={d("reviewCount")}
              className="inp"
            />
          </div>
        </div>
        <fieldset className="rounded-md border border-line p-3">
          <legend className="px-1 text-sm font-medium">Exam stores</legend>
          {exams.length ? (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {exams.map((e) => (
                <label key={e.slug} className="text-sm">
                  <input
                    type="checkbox"
                    name="exams"
                    value={e.slug}
                    defaultChecked={p?.exams?.includes(e.slug)}
                  />{" "}
                  {e.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Add exams in the Exams tab first.
            </p>
          )}
        </fieldset>
        <div className="flex flex-wrap gap-5 text-sm">
          <label>
            <input
              type="checkbox"
              name="featured"
              defaultChecked={p?.featured}
            />{" "}
            Featured{" "}
            <span className="text-muted">(order it under Featured order)</span>
          </label>
          <label>
            <input
              type="checkbox"
              name="active"
              defaultChecked={p ? p.active : true}
            />{" "}
            Active
          </label>
        </div>
        {err && (
          <p role="alert" className="text-sm text-red-600">
            {err}
          </p>
        )}
        <div className="flex gap-3">
          <button className="btn">Save product</button>
          <Link href="/admin" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
      <aside className="md:sticky md:top-6 md:self-start">
        <p className="mb-2 text-sm font-medium">Card preview</p>
        <Card
          preview
          store={provs.find((x) => x.slug === v.provider)?.name}
          cat={cats.find((x) => x.slug === v.category)?.name}
          p={{
            name: v.name || "Product name",
            slug: "",
            description: "",
            image: local || v.image,
            category: "",
            subcategory: "",
            exams: [],
            affiliateUrl: v.affiliateUrl || "#",
            price: v.price ? Number(v.price) : null,
            featured: false,
            active: true,
          }}
        />
      </aside>
    </div>
  );
}

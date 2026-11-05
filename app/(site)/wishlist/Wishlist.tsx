"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWish } from "@/components/wish";
import Card, { Empty } from "@/components/Card";
import type { Product } from "@/lib/db";
type Data = { items: Product[]; stores: Record<string, string>; cats: Record<string, string> };
export default function Wishlist() {
  const { ids } = useWish(), [d, setD] = useState<Data | null>(null), key = ids.join(",");
  useEffect(() => { if (!key) { setD({ items: [], stores: {}, cats: {} }); return; } fetch(`/api/wishlist?ids=${key}`).then(r => r.json()).then(setD).catch(() => setD({ items: [], stores: {}, cats: {} })); }, [key]);
  if (!d) return <p className="text-muted">Loading…</p>;
  const items = ids.map(i => d.items.find(p => p.id === i)).filter(Boolean) as Product[];
  if (!items.length) return <Empty>Nothing saved yet. Tap the heart on any product to save it here. <Link href="/products" className="font-semibold text-brand">Browse products</Link></Empty>;
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{items.map(p => <Card key={p.id} p={p} store={d.stores[p.provider || ""]} cat={d.cats[p.category]} />)}</div>;
}

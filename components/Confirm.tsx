"use client";
import { useTransition } from "react";
// Asks for confirmation, runs a server action, and shows the message it returns (if any).
export default function Confirm({ action, msg, children, className }: { action: () => Promise<string | void>; msg: string; children: React.ReactNode; className?: string }) {
  const [busy, go] = useTransition();
  return <form onSubmit={e => { e.preventDefault(); if (confirm(msg)) go(async () => { const r = await action(); if (typeof r === "string") alert(r); }); }}>
    <button disabled={busy} className={className}>{children}</button></form>;
}

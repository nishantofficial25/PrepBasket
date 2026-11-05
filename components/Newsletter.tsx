"use client";
import { useFormState, useFormStatus } from "react-dom";
import { subscribe } from "@/lib/actions";
function Btn() { const { pending } = useFormStatus(); return <button disabled={pending} className="btn !px-4">{pending ? "…" : "Subscribe"}</button>; }
export default function Newsletter() {
  const [msg, act] = useFormState(subscribe, "");
  return <form action={act} className="mt-3">
    <div className="flex gap-2"><input name="email" type="email" required placeholder="Enter your email" aria-label="Email address" autoComplete="email" className="inp min-w-0" /><Btn /></div>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
    {msg && <p role="status" className={`mt-2 text-xs ${msg.startsWith("Thanks") ? "text-brand" : "text-red-600"}`}>{msg}</p>}</form>;
}

"use client";
import { useFormState } from "react-dom";
import { login } from "@/lib/actions";
export default function L() {
  const [err, act] = useFormState(login, null as string | null);
  return <form action={act} className="panel mx-auto mt-12 max-w-sm space-y-4 p-7"><h1 className="text-xl font-bold">Admin sign in</h1><input name="email" type="email" required placeholder="Email" className="inp" autoComplete="username" /><input name="password" type="password" required placeholder="Password" className="inp" autoComplete="current-password" />{err && <p role="alert" className="text-sm text-red-600">{err}</p>}<button className="btn w-full">Sign in</button></form>;
}

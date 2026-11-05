import Link from "next/link";
export default function NotFound() {
  return <div className="wrap grid min-h-[60vh] place-items-center py-20 text-center"><div><p className="text-sm font-semibold text-brand">404</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1><p className="mt-2 text-muted">The page you’re looking for doesn’t exist or has moved.</p><Link href="/" className="btn mt-6">Back to home</Link></div></div>;
}

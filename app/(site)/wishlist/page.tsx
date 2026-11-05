import Wishlist from "./Wishlist";
export const metadata = { title: "Your wishlist", robots: { index: false } };
export default function Page() { return <div className="wrap py-5 sm:py-7"><h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">Your wishlist</h1><p className="mb-6 text-sm text-muted">Saved on this device only. No account needed.</p><Wishlist /></div>; }

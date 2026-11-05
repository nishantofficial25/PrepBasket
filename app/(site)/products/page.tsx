import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Listing from "@/components/Listing";
export const metadata = { title: "All products", alternates: { canonical: "/products" } };
export default function Products({ searchParams }: any) {
  return <div className="wrap py-3 sm:py-7"><nav aria-label="Breadcrumb" className="mb-3 hidden lg:flex items-center gap-1 text-xs text-muted"><Link href="/" className="hover:text-brand">Home</Link><ChevronRight size={12} /><span className="text-ink">All products</span></nav>
    <h1 className="max-lg:sr-only mb-6 text-2xl font-bold tracking-tight sm:text-3xl">All products</h1>
    <Listing base={{ active: true }} path="/products" sp={searchParams} categoryFacet /></div>;
}

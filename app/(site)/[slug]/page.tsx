import { notFound } from "next/navigation";
import { DISCLOSURE as AS } from "@/lib/site";
const P: Record<string, [string, string[]]> = {
  about: [
    "About Us",
    [
      "PrepBasket, by Sahiphoto, helps Indian students discover useful study products and find them at trusted online stores such as Amazon.in and Flipkart.",
      "We are a discovery site only. We do not sell, stock or deliver anything.",
    ],
  ],
  contact: [
    "Contact Us",
    [
      process.env.CONTACT_EMAIL
        ? `For questions, corrections or removal requests, email ${process.env.CONTACT_EMAIL}.`
        : "For questions, corrections or removal requests, please reach out to the site owner. Contact details will be published here shortly.",
    ],
  ],
  "affiliate-disclosure": [
    "Affiliate Disclosure",
    [
      AS,
      "Product links go to partner stores such as Amazon.in and Flipkart and may contain our affiliate tag. If you buy, we may earn a commission at no extra cost to you.",
      "Purchases are made directly on the store’s website. PrepBasket does not sell, stock or deliver products. Prices and availability are controlled by the store and can change.",
    ],
  ],
  "privacy-policy": [
    "Privacy Policy",
    [
      "PrepBasket has no user accounts and does not knowingly collect personal data from visitors. Search terms are processed to show results. If you subscribe to our newsletter, we store your email address only to send you updates, and you can ask us to remove it at any time.",
      "Our hosting provider may keep standard server logs. When you click through to a store, that store’s own privacy policy applies.",
      "Contact us to ask about any data we hold about you.",
    ],
  ],
  "terms-and-conditions": [
    "Terms and Conditions",
    [
      "Use of this site means you accept these terms. Content is for general information only.",
      "We are not a party to any transaction between you and any store or seller you reach through our links.",
    ],
  ],
  disclaimer: [
    "Disclaimer",
    [
      "Product details, prices and ratings shown here may be out of date. Always confirm on the store’s website before buying.",
      AS,
    ],
  ],
  "editorial-policy": [
    "Editorial Policy",
    [
      "We list products on merit for student use. Affiliate relationships do not change what we write. We only show price, rating and review figures that we have verified on the store’s website.",
    ],
  ],
  "cookie-policy": [
    "Cookie Policy",
    [
      "The public site sets no tracking cookies. Your wishlist is saved in your browser's local storage on your own device and is never sent to us. The admin area uses one essential sign-in cookie for the site owner.",
      "If analytics or ads are added later, this policy and a consent notice will be updated first.",
    ],
  ],
};
export function generateMetadata({ params }: any) {
  const p = P[params.slug];
  return p ? { title: p[0], alternates: { canonical: `/${params.slug}` } } : {};
}
export default function Page({ params }: any) {
  const p = P[params.slug];
  if (!p) notFound();
  return (
    <article className="wrap max-w-3xl space-y-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{p[0]}</h1>
      {p[1].map((t, i) => (
        <p key={i} className="text-slate-700">
          {t}
        </p>
      ))}
    </article>
  );
}

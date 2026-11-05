import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { SITE } from "@/lib/site";
const f = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "PrepBasket – Student shopping picks",
    template: "%s | PrepBasket",
  },
  description:
    "Hand-picked stationery, exam books, study accessories and tech for Indian students, with links to trusted stores.",
  openGraph: { siteName: "PrepBasket", type: "website" },
};
export const viewport: Viewport = { themeColor: "#1B4A31" };
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className={`${f.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

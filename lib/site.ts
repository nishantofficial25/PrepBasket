export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const SITE_NAME = "PrepBasket";
// Text shown in the thin bar at the very top of every page.
export const TOPBAR_LEFT =
  "Explore a wide range of study essentials, stationery and office supplies.";
export const TOPBAR_RIGHT = "Buy securely on trusted stores";
// Shown in the footer and legal pages. Edit to match your affiliate programmes.
export const DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases. Links to other stores may also be affiliate links.";
// Footer social icons appear only for the URLs you set (NEXT_PUBLIC_* env vars).
export const SOCIALS = [
  {
    key: "youtube",
    label: "YouTube",
    url: process.env.NEXT_PUBLIC_YOUTUBE_URL,
  },
  {
    key: "instagram",
    label: "Instagram",
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    url: process.env.NEXT_PUBLIC_WHATSAPP_URL,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    url: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  },
].filter((s) => s.url) as { key: string; label: string; url: string }[];

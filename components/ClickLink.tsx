"use client";
export default function ClickLink({ id, href, className, children }: { id?: string; href: string; className?: string; children: React.ReactNode }) {
  const t = () => { if (id) navigator.sendBeacon?.(`/api/click/${id}`); };
  return <a href={href} target="_blank" rel="sponsored nofollow noopener noreferrer" className={className} onClick={t} onAuxClick={t}>{children}</a>;
}

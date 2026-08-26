"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTIONS: { label: string; items: { label: string; href: string; adminOnly?: boolean }[] }[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/blogs" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Tags", href: "/admin/tags" },
      { label: "Authors", href: "/admin/authors" },
      { label: "Media Library", href: "/admin/media" },
      { label: "FAQs", href: "/admin/faqs" },
      { label: "Glossary", href: "/admin/glossary" },
    ],
  },
  {
    label: "Trust & Proof",
    items: [
      { label: "Clients / Logos", href: "/admin/clients" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "Case Studies", href: "/admin/case-studies" },
      { label: "Portfolio", href: "/admin/portfolio" },
    ],
  },
  {
    label: "Site Structure",
    items: [
      { label: "Services", href: "/admin/services" },
      { label: "Industries", href: "/admin/industries" },
      { label: "Locations", href: "/admin/locations" },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Leads (CRM)", href: "/admin/leads" },
      { label: "Newsletter", href: "/admin/newsletter" },
      { label: "Backlink Outreach", href: "/admin/backlinks" },
    ],
  },
  {
    label: "SEO",
    items: [{ label: "SEO Dashboard", href: "/admin/seo" }],
  },
  {
    label: "System",
    items: [
      { label: "Redirects", href: "/admin/redirects", adminOnly: true },
      { label: "Users", href: "/admin/users", adminOnly: true },
      { label: "Settings", href: "/admin/settings", adminOnly: true },
    ],
  },
];

export function AdminSidebar({ role }: { role: "ADMIN" | "EDITOR" }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4 text-sm">
      <Link href="/admin" className="px-2 text-lg font-bold">
        OlyxMedia <span className="text-muted font-normal">Admin</span>
      </Link>
      {SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {section.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items
              .filter((item) => !item.adminOnly || role === "ADMIN")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-2 py-1.5 hover:bg-surface",
                    pathname === item.href && "bg-brand-soft font-medium text-brand"
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

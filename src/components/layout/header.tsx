"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import type { SiteSetting } from "@prisma/client";

export function Header({ settings }: { settings: SiteSetting }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {settings.businessName}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground">
            <Phone className="h-4 w-4" /> {settings.phone}
          </a>
          <Link href="/contact">
            <Button variant="accent">Book a Free Strategy Call</Button>
          </Link>
        </div>

        <button
          type="button"
          className="p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2.5 text-sm font-medium hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2">
              <Button variant="accent" className="w-full">
                Book a Free Strategy Call
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

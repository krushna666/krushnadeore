import Link from "next/link";
import { Phone, MessageCircle, FileText } from "lucide-react";
import type { SiteSetting } from "@prisma/client";

export function MobileBottomNav({ settings }: { settings: SiteSetting }) {
  const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background md:hidden">
      <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium">
        <Phone className="h-5 w-5" />
        Call
      </a>
      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 border-x border-border bg-[#25D366] py-2.5 text-xs font-medium text-white">
        <MessageCircle className="h-5 w-5" fill="white" />
        WhatsApp
      </a>
      <Link href="/contact" className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium">
        <FileText className="h-5 w-5" />
        Get Quote
      </Link>
    </nav>
  );
}

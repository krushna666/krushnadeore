import { MessageCircle } from "lucide-react";
import type { SiteSetting } from "@prisma/client";

export function WhatsAppButton({ settings }: { settings: SiteSetting }) {
  const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappDefaultMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with OlyxMedia on WhatsApp"
      className="fixed bottom-20 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 md:bottom-6 md:flex"
    >
      <MessageCircle className="h-7 w-7" fill="white" />
    </a>
  );
}

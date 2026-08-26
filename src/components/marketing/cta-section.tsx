import Link from "next/link";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/constants";

export function CtaSection({
  title = "Ready to grow your business?",
  subtitle = "Book a free strategy call and get a growth plan tailored to your business.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-ink py-16 text-white">
      <div className="container-page text-center">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">{subtitle}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/contact">
            <Button size="lg" variant="accent">
              Book a Free Strategy Call
            </Button>
          </Link>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

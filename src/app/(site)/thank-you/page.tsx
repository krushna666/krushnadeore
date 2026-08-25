import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Thank You | OlyxMedia",
  description: "Thanks for reaching out to OlyxMedia.",
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Thank you for reaching out to OlyxMedia.</h1>
      <p className="mt-4 max-w-md text-muted">We&apos;ll get back to you shortly.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          <Button variant="accent" size="lg">
            WhatsApp us now
          </Button>
        </a>
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </section>
  );
}

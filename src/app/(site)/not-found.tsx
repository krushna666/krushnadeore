import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Looks like this page took a wrong turn.</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
        <Link href="/services">
          <Button variant="outline">View Services</Button>
        </Link>
        <Link href="/blog">
          <Button variant="outline">Read Blog</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Contact OlyxMedia</Button>
        </Link>
      </div>
    </section>
  );
}

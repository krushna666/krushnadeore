import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm font-semibold">404</p>
        <h1 className="text-2xl font-bold">Looks like this page took a wrong turn.</h1>
        <Link href="/" className="text-brand underline">
          Go Home
        </Link>
      </body>
    </html>
  );
}

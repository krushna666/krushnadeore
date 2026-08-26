import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";

const ADMIN_ONLY_PREFIXES = ["/admin/users", "/admin/settings", "/admin/redirects"];

async function handleAdmin(request: NextRequest, pathname: string) {
  const isPublicAdminRoute =
    pathname === "/admin/login" || pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";

  if (isPublicAdminRoute) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  if (!token) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (ADMIN_ONLY_PREFIXES.some((p) => pathname.startsWith(p)) && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
  }

  if (token.mustChangePassword && pathname !== "/admin/change-password") {
    return NextResponse.redirect(new URL("/admin/change-password", request.url));
  }

  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdmin(request, pathname);
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Legacy/changed URL support — CMS-managed 301/302 redirects.
  const redirect = await prisma.redirect
    .findUnique({ where: { fromPath: pathname } })
    .catch(() => null);

  if (redirect?.active) {
    return NextResponse.redirect(new URL(redirect.toPath, request.url), redirect.statusCode);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/|.*\\..*).*)"],
};

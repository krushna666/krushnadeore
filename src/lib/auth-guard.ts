import "server-only";
import { auth } from "@/lib/auth";

export class AuthError extends Error {}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new AuthError("UNAUTHORIZED");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new AuthError("FORBIDDEN");
  return user;
}

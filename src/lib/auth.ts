import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/rate-limit";

const authSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
  throw new Error(
    "AUTH_SECRET or NEXTAUTH_SECRET must be configured."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,

  trustHost: true,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials, request) {
        // ---------------------------------------------------------------
        // Validate login input
        // ---------------------------------------------------------------
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.trim().toLowerCase();
        const password = parsed.data.password;

        // ---------------------------------------------------------------
        // Get client IP
        // ---------------------------------------------------------------
        const forwardedFor =
          request.headers.get("x-forwarded-for");

        const realIp =
          request.headers.get("x-real-ip");

        const ip =
          forwardedFor?.split(",")[0]?.trim() ||
          realIp ||
          "unknown";

        // ---------------------------------------------------------------
        // Rate limit login attempts
        // 10 attempts / 15 minutes
        // ---------------------------------------------------------------
        const { ok } = rateLimit(
          `login:${ip}`,
          10,
          15 * 60 * 1000
        );

        if (!ok) {
          return null;
        }

        // ---------------------------------------------------------------
        // Find user
        // ---------------------------------------------------------------
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }

        // ---------------------------------------------------------------
        // Verify password
        // ---------------------------------------------------------------
        const validPassword = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!validPassword) {
          return null;
        }

        // ---------------------------------------------------------------
        // Return authenticated user
        // ---------------------------------------------------------------
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],

  callbacks: {
    // ---------------------------------------------------------------
    // JWT
    // ---------------------------------------------------------------
    async jwt({ token, user }) {
      if (user) {
        

        token.role = (
          user as {
            role: "ADMIN" | "EDITOR";
          }
        ).role;

        token.mustChangePassword = (
          user as {
            mustChangePassword: boolean;
          }
        ).mustChangePassword;
      }

      return token;
    },

    // ---------------------------------------------------------------
    // Session
    // ---------------------------------------------------------------
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        session.user.role =
          token.role as "ADMIN" | "EDITOR";

        session.user.mustChangePassword =
          token.mustChangePassword as boolean;
      }

      return session;
    },
  },
});
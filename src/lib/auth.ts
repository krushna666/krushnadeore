import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Replace this with your actual database import
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
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

      async authorize(credentials) {
        try {
          // Validate credentials
          if (
            !credentials?.email ||
            !credentials?.password
          ) {
            console.error("Missing email or password");
            return null;
          }

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password);

          // Find user
          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            console.error("User not found:", email);
            return null;
          }

          // Check password
          if (!user.password) {
            console.error("User does not have a password");
            return null;
          }

          const passwordValid = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordValid) {
            console.error("Invalid password for:", email);
            return null;
          }

          // Return authenticated user
          return {
            id: String(user.id),
            name: user.name || email,
            email: user.email,
          };
        } catch (error) {
          console.error("AUTHORIZATION ERROR:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },

  secret: process.env.AUTH_SECRET,

  trustHost: true,
});
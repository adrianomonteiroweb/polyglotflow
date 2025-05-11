import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          console.log("Attempting to find user with email:", credentials.email);
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          });

          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.password_hash) {
            console.log("No password hash found for user:", user.email);
            return null;
          }

          console.log("Found user:", {
            email: user.email,
            hasPassword: !!user.password_hash,
            passwordHash: user.password_hash,
          });

          console.log("Attempting to verify password for user:", user.email);
          console.log("Comparing passwords:", {
            provided: credentials.password,
            storedHash: user.password_hash,
          });

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          console.log("Password verification result:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Invalid password for user:", user.email);
            return null;
          }

          console.log("Login successful for user:", user.email);
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name || "",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

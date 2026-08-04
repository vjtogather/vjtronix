import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { signInSchema } from "@/lib/validations/auth";
import { RoleName } from "@/generated/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/verify-request",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsedCredentials.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            password: true,
            isActive: true,
          },
        });

        if (!user?.password || !user.isActive) {
          return null;
        }

        const passwordsMatch = await verifyPassword(
          parsedCredentials.data.password,
          user.password,
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: false,
    }),
    GitHub({
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { isActive: true },
      });

      return existingUser?.isActive ?? true;
    },
    async session({ session, token }) {
      if (!token.sub) {
        return session;
      }

      session.user.id = token.sub;
      session.user.roles = [];

      try {
        const userRoles = await prisma.userRole.findMany({
          where: { userId: token.sub },
          select: { role: { select: { name: true } } },
        });

        session.user.roles = userRoles.map(({ role }) => role.name) as RoleName[];
      } catch {
        // A role lookup must not turn an otherwise valid session into a blank page.
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) {
        throw new Error("Auth.js created a user without an ID.");
      }

      const customerRole = await prisma.role.upsert({
        where: { name: RoleName.CUSTOMER },
        create: {
          name: RoleName.CUSTOMER,
          description: "Purchased-product access.",
        },
        update: {},
      });

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: customerRole.id,
          },
        },
        create: {
          userId: user.id,
          roleId: customerRole.id,
        },
        update: {},
      });

      try {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            event: "AUTH_USER_CREATED",
          },
        });
      } catch {
        // Audit logging is best-effort and must not block user provisioning.
      }
    },
    async signIn({ user, account }) {
      try {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            event: "AUTH_SIGN_IN",
            metadata: account ? { provider: account.provider } : undefined,
          },
        });
      } catch {
        // Audit logging is best-effort and must not prevent a successful sign-in.
      }
    },
    async signOut(message) {
      const actorId =
        "session" in message ? message.session?.userId : message.token?.sub;

      if (!actorId) {
        return;
      }

      try {
        await prisma.auditLog.create({
          data: {
            actorId,
            event: "AUTH_SIGN_OUT",
          },
        });
      } catch {
        // Audit logging is best-effort and must not prevent a successful sign-out.
      }
    },
  },
});

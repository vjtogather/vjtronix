import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
//import Nodemailer from "next-auth/providers/nodemailer";

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
    // Nodemailer({
    //   from: getRequiredEnvironmentValue("AUTH_EMAIL_FROM"),
    //   server: {
    //     host: getRequiredEnvironmentValue("AUTH_EMAIL_SERVER_HOST"),
    //     port: Number(process.env.AUTH_EMAIL_SERVER_PORT ?? 587),
    //     auth: {
    //       user: getRequiredEnvironmentValue("AUTH_EMAIL_SERVER_USER"),
    //       pass: getRequiredEnvironmentValue("AUTH_EMAIL_SERVER_PASSWORD"),
    //     },
    //   },
    // }),
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

      const userRoles = await prisma.userRole.findMany({
        where: { userId: token.sub },
        select: { role: { select: { name: true } } },
      });

      session.user.id = token.sub;
      session.user.roles = userRoles.map(({ role }) => role.name) as RoleName[];

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

      await prisma.$transaction([
        prisma.userRole.upsert({
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
        }),
        prisma.auditLog.create({
          data: {
            actorId: user.id,
            event: "AUTH_USER_CREATED",
          },
        }),
      ]);
    },
    async signIn({ user, account }) {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          event: "AUTH_SIGN_IN",
          metadata: account ? { provider: account.provider } : undefined,
        },
      });
    },
    async signOut(message) {
      const actorId =
        "session" in message ? message.session?.userId : message.token?.sub;

      if (!actorId) {
        return;
      }

      await prisma.auditLog.create({
        data: {
          actorId,
          event: "AUTH_SIGN_OUT",
        },
      });
    },
  },
});

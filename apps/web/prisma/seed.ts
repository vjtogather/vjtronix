import { hashPassword } from "../src/lib/password";
import { prisma } from "../src/lib/prisma";
import { RoleName } from "../src/generated/prisma/client";

const roles: Array<{ name: RoleName; description: string }> = [
  { name: RoleName.SUPER_ADMIN, description: "Full platform access." },
  { name: RoleName.ADMIN, description: "Platform administration access." },
  { name: RoleName.EDITOR, description: "Content editing access." },
  { name: RoleName.AUTHOR, description: "Content authoring access." },
  { name: RoleName.STUDENT, description: "Learning access." },
  { name: RoleName.CUSTOMER, description: "Purchased-product access." },
];

async function main() {
  await prisma.$transaction(
    roles.map(({ name, description }) =>
      prisma.role.upsert({
        where: { name },
        create: { name, description },
        update: { description },
      }),
    ),
  );

  const adminCount = await prisma.user.count({
    where: {
      roles: {
        some: {
          role: {
            name: { in: [RoleName.ADMIN, RoleName.SUPER_ADMIN] },
          },
        },
      },
    },
  });

  if (adminCount === 0) {
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@vjtronix.in";
    const adminName = process.env.ADMIN_NAME ?? "Administrator";
    const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin1234!";
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.ADMIN } });
    const passwordHash = await hashPassword(adminPassword);

    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingUser) {
      await prisma.$transaction([
        prisma.user.update({
          where: { email: adminEmail },
          data: {
            name: adminName,
            password: passwordHash,
            emailVerified: new Date(),
            isActive: true,
          },
        }),
        prisma.userRole.upsert({
          where: {
            userId_roleId: {
              userId: existingUser.id,
              roleId: adminRole.id,
            },
          },
          create: {
            userId: existingUser.id,
            roleId: adminRole.id,
          },
          update: {},
        }),
      ]);
      console.info(`Assigned ADMIN role to existing user ${adminEmail}.`);
    } else {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: passwordHash,
          emailVerified: new Date(),
          isActive: true,
          roles: {
            create: { roleId: adminRole.id },
          },
        },
      });
      console.info(`Seeded default admin user: ${adminEmail}`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    await prisma.$disconnect();
    throw error;
  });

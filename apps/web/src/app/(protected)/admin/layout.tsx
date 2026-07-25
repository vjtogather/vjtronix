import { AdminShell } from "@/components/admin/admin-shell";
import { RoleName } from "@/generated/prisma/client";
import { requireRole } from "@/lib/auth/authorization";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireRole([RoleName.ADMIN, RoleName.SUPER_ADMIN]);
  const isSuperAdmin = session.user.roles.includes(RoleName.SUPER_ADMIN);

  return <AdminShell isSuperAdmin={isSuperAdmin} user={session.user}>{children}</AdminShell>;
}

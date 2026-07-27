import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

// Middleware already blocks this path, but the layout checks again so a
// misconfigured matcher can never expose the dashboard.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return <AdminShell userName={session.user.name ?? "Admin"}>{children}</AdminShell>;
}

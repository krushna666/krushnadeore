import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const user = session.user;

  return (
    <div className="grid min-h-screen grid-cols-1 bg-surface md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-background md:block">
        <AdminSidebar role={user.role} />
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-6">
          <p className="text-sm text-muted">
            Signed in as <span className="font-medium text-foreground">{user.name || user.email}</span>{" "}
            <span className="ml-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
              {user.role}
            </span>
          </p>
          <LogoutButton />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { updateUserRoleAction, deleteUserAction } from "./actions";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Users | OlyxMedia Admin" };

export default async function UsersPage() {
  const currentAdmin = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <CreateUserForm />
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted">{u.email}</td>
                <td className="p-3">
                  {u.id === currentAdmin.id ? (
                    u.role
                  ) : (
                    <form action={updateUserRoleAction.bind(null, u.id)} className="flex gap-1">
                      <Select name="role" defaultValue={u.role} className="h-8 text-xs">
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                      </Select>
                      <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
                        Save
                      </Button>
                    </form>
                  )}
                </td>
                <td className="p-3 text-muted">{formatDate(u.createdAt)}</td>
                <td className="p-3">
                  {u.id !== currentAdmin.id && (
                    <form action={deleteUserAction.bind(null, u.id)}>
                      <Button size="sm" variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

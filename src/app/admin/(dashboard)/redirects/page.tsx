import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createRedirectAction, deleteRedirectAction } from "./actions";

export const metadata = { title: "Redirects | OlyxMedia Admin" };

export default async function RedirectsPage() {
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Redirects</h1>
      <form action={createRedirectAction} className="flex flex-wrap items-end gap-3 rounded-2xl border border-border p-4">
        <div>
          <label className="mb-1 block text-xs text-muted">From path</label>
          <Input name="fromPath" placeholder="/old-url" required className="w-56" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">To path</label>
          <Input name="toPath" placeholder="/new-url" required className="w-56" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Status</label>
          <Input name="statusCode" type="number" defaultValue={301} className="w-24" />
        </div>
        <Button type="submit">Add redirect</Button>
      </form>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Code</th>
              <th className="p-3">Active</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{r.fromPath}</td>
                <td className="p-3 font-mono text-xs">{r.toPath}</td>
                <td className="p-3">{r.statusCode}</td>
                <td className="p-3">
                  <Badge variant={r.active ? "success" : "outline"}>{r.active ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="p-3">
                  <form action={deleteRedirectAction.bind(null, r.id)}>
                    <Button size="sm" variant="destructive" type="submit">
                      Delete
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {redirects.length === 0 && <p className="p-6 text-center text-sm text-muted">No redirects configured.</p>}
      </div>
    </div>
  );
}

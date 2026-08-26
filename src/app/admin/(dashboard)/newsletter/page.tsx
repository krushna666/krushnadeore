import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { unsubscribeAction, deleteSubscriberAction } from "./actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Newsletter | OlyxMedia Admin" };

export default async function NewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Newsletter Subscribers</h1>
        <Link href="/api/admin/newsletter/export">
          <Button variant="outline">Export CSV</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Subscribed</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3">{s.email}</td>
                <td className="p-3 text-muted">{s.name || "—"}</td>
                <td className="p-3">
                  <Badge variant={s.status === "ACTIVE" ? "success" : "outline"}>{s.status}</Badge>
                </td>
                <td className="p-3 text-muted">{formatDate(s.subscribedAt)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {s.status === "ACTIVE" && (
                      <form action={unsubscribeAction.bind(null, s.id)}>
                        <Button size="sm" variant="outline" type="submit">
                          Unsubscribe
                        </Button>
                      </form>
                    )}
                    <form action={deleteSubscriberAction.bind(null, s.id)}>
                      <Button size="sm" variant="destructive" type="submit">
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && <p className="p-6 text-center text-sm text-muted">No subscribers yet.</p>}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createBacklinkAction, updateBacklinkStatusAction, deleteBacklinkAction } from "./actions";

export const metadata = { title: "Backlink Outreach | OlyxMedia Admin" };

const STATUSES = ["PROSPECT", "CONTACTED", "REPLIED", "PUBLISHED", "REJECTED"] as const;
const statusVariant: Record<string, "default" | "success" | "warning" | "outline" | "danger"> = {
  PROSPECT: "outline",
  CONTACTED: "warning",
  REPLIED: "default",
  PUBLISHED: "success",
  REJECTED: "danger",
};

export default async function BacklinksPage() {
  const backlinks = await prisma.backlink.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">SEO Outreach / Backlink Tracker</h1>
        <p className="text-sm text-muted">Legitimate link-building outreach only — no spam link schemes.</p>
      </div>

      <form action={createBacklinkAction} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-3">
        <Input name="website" placeholder="Website URL" required />
        <Input name="contactName" placeholder="Contact name" />
        <Input name="email" placeholder="Contact email" />
        <Input name="category" placeholder="Category (e.g. marketing blog)" />
        <Input name="authority" type="number" placeholder="Authority score" />
        <Select name="status" defaultValue="PROSPECT">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Textarea name="notes" placeholder="Notes" className="sm:col-span-3" rows={2} />
        <Button type="submit" className="sm:col-span-3">
          Add prospect
        </Button>
      </form>

      <div className="space-y-3">
        {backlinks.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{b.domain}</p>
                <p className="text-xs text-muted">
                  {b.contactName} {b.email && `· ${b.email}`}
                </p>
              </div>
              <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
            </div>
            <form action={updateBacklinkStatusAction.bind(null, b.id)} className="mt-3 grid gap-2 sm:grid-cols-4">
              <Select name="status" defaultValue={b.status}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Input name="linkUrl" placeholder="Published link URL" defaultValue={b.linkUrl || ""} />
              <Input name="anchorText" placeholder="Anchor text" defaultValue={b.anchorText || ""} />
              <Input name="response" placeholder="Response notes" defaultValue={b.response || ""} />
              <Button type="submit" size="sm" variant="outline" className="sm:col-span-4">
                Update
              </Button>
            </form>
            <form action={deleteBacklinkAction.bind(null, b.id)} className="mt-2">
              <Button size="sm" variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        ))}
        {backlinks.length === 0 && <p className="text-sm text-muted">No outreach prospects yet.</p>}
      </div>
    </div>
  );
}

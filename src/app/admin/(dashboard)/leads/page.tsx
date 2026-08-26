import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateLeadStatusAction, deleteLeadAction } from "./actions";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Prisma, LeadStatus } from "@prisma/client";

export const metadata = { title: "Leads (CRM) | OlyxMedia Admin" };

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"] as const;

const statusVariant: Record<string, "default" | "success" | "warning" | "outline" | "danger"> = {
  NEW: "warning",
  CONTACTED: "default",
  QUALIFIED: "default",
  PROPOSAL_SENT: "default",
  WON: "success",
  LOST: "danger",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where: Prisma.LeadWhereInput = {
    ...(status && STATUSES.includes(status as (typeof STATUSES)[number]) ? { status: status as LeadStatus } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads (CRM)</h1>
        <Link href="/api/admin/leads/export">
          <Button variant="outline">Export CSV</Button>
        </Link>
      </div>

      <form className="flex flex-wrap gap-3">
        <Input name="q" placeholder="Search name, email, phone, company" defaultValue={q} className="max-w-xs" />
        <Select name="status" defaultValue={status || ""}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase text-muted">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Service</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border align-top">
                <td className="p-3">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted">{lead.company}</p>
                </td>
                <td className="p-3 text-xs text-muted">
                  <p>{lead.phone}</p>
                  <p>{lead.email}</p>
                </td>
                <td className="p-3 text-muted">{lead.serviceRequired || "—"}</td>
                <td className="p-3 text-muted">{lead.budget || "—"}</td>
                <td className="p-3 text-muted">{lead.source || lead.utmSource || "—"}</td>
                <td className="p-3">
                  <form action={updateLeadStatusAction.bind(null, lead.id)} className="flex items-center gap-1">
                    <Select name="status" defaultValue={lead.status} className="h-8 text-xs">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </Select>
                    <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
                      Update
                    </Button>
                  </form>
                  <Badge variant={statusVariant[lead.status]} className="mt-1">
                    {lead.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="p-3 text-xs text-muted">{formatDate(lead.createdAt)}</td>
                <td className="p-3">
                  <form action={deleteLeadAction.bind(null, lead.id)}>
                    <Button size="sm" variant="destructive" type="submit">
                      Delete
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && <p className="p-6 text-center text-sm text-muted">No leads yet.</p>}
      </div>
      <p className="text-xs text-muted">
        <Link href="/admin/leads">Reset filters</Link>
      </p>
    </div>
  );
}

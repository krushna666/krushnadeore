import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";

function toCsvValue(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireUser();
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const headers = ["Name", "Company", "Phone", "Email", "Service", "Budget", "Status", "Source", "Created"];
  const rows = leads.map((l) =>
    [l.name, l.company, l.phone, l.email, l.serviceRequired, l.budget, l.status, l.source, l.createdAt.toISOString()]
      .map(toCsvValue)
      .join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="olyxmedia-leads.csv"`,
    },
  });
}

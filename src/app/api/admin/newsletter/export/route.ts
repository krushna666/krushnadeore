import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";

function toCsvValue(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  await requireUser();
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });

  const headers = ["Email", "Name", "Status", "Subscribed"];
  const rows = subscribers.map((s) =>
    [s.email, s.name, s.status, s.subscribedAt.toISOString()].map(toCsvValue).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="olyxmedia-newsletter.csv"`,
    },
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Call this on a schedule (e.g. every 5 minutes via Vercel Cron or any
// external scheduler) with header `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await prisma.post.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
    select: { id: true },
  });

  if (due.length > 0) {
    await prisma.post.updateMany({
      where: { id: { in: due.map((p) => p.id) } },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
  }

  return NextResponse.json({ published: due.length });
}

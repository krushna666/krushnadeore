import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/breadcrumbs";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata = buildMetadata({
  title: "Client Testimonials | OlyxMedia",
  description: "What OlyxMedia clients say about working with us.",
  path: "/testimonials",
});

function getYouTubeEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const isYouTube = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(url.hostname);
    if (!isYouTube) return null;

    const pathParts = url.pathname.split("/").filter(Boolean);
    const videoId = url.hostname === "youtu.be"
      ? pathParts[0]
      : url.searchParams.get("v") || (pathParts[0] && ["embed", "shorts", "live"].includes(pathParts[0]) ? pathParts[1] : null);
    return videoId && /^[A-Za-z0-9_-]{6,}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
      : null;
  } catch {
    return null;
  }
}

function isUploadedVideo(value: string): boolean {
  return /\.(mp4|webm|mov)(?:$|\?)/i.test(value);
}

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <Breadcrumbs items={[{ name: "Testimonials", path: "/testimonials" }]} />
      <section className="container-page pb-16">
        <h1 className="text-4xl font-bold tracking-tight">Client Testimonials</h1>
        {testimonials.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border p-5">
                {t.videoUrl && getYouTubeEmbedUrl(t.videoUrl) && (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-surface">
                    <iframe
                      src={getYouTubeEmbedUrl(t.videoUrl)!}
                      title={`Video testimonial from ${t.clientName}`}
                      className="h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}
                {t.videoUrl && isUploadedVideo(t.videoUrl) && (
                  <div className="mb-4 overflow-hidden rounded-lg bg-surface">
                    <video src={t.videoUrl} controls preload="metadata" className="aspect-video w-full" />
                  </div>
                )}
                <p className="text-sm">&ldquo;{t.review}&rdquo;</p>
                <p className="mt-3 text-sm font-semibold">{t.clientName}</p>
                <p className="text-xs text-muted">
                  {t.designation}
                  {t.company ? `, ${t.company}` : ""}
                </p>
                {t.googleReviewUrl && (
                  <a href={t.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-brand hover:underline">
                    View on Google →
                  </a>
                )}
                {t.videoUrl && !getYouTubeEmbedUrl(t.videoUrl) && (
                  <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-brand hover:underline">
                    Watch video testimonial →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">Client testimonials coming soon.</p>
        )}
      </section>
      <CtaSection />
    </>
  );
}

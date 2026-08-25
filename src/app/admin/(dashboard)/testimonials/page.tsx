import { prisma } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createTestimonialAction, deleteTestimonialAction } from "./actions";

export const metadata = { title: "Testimonials | OlyxMedia Admin" };

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <p className="text-sm text-muted">Never fabricate a review. Only tick &ldquo;Verified&rdquo; for a real, permission-cleared testimonial.</p>
      </div>

      <form action={createTestimonialAction} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
        <Input name="clientName" placeholder="Client name" required />
        <Input name="designation" placeholder="Designation" />
        <Input name="company" placeholder="Company" />
        <Input name="project" placeholder="Project" />
        <Input name="rating" type="number" min={1} max={5} placeholder="Rating (1-5)" />
        <Input name="googleReviewUrl" placeholder="Google review URL (optional)" />
        <Input name="videoUrl" placeholder="Video testimonial URL (optional)" className="sm:col-span-2" />
        <Input name="videoFile" type="file" accept="video/mp4,video/webm,video/quicktime" className="sm:col-span-2" />
        <Textarea name="review" placeholder="Review text" required rows={3} className="sm:col-span-2" />
        <div className="flex items-center gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="verified" /> Verified
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" /> Published
          </label>
        </div>
        <Button type="submit" className="sm:col-span-2">
          Add testimonial
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{t.clientName}</p>
                <p className="text-xs text-muted">
                  {t.designation}
                  {t.company ? `, ${t.company}` : ""}
                </p>
              </div>
              <div className="flex gap-1">
                {t.verified && <Badge variant="success">Verified</Badge>}
                <Badge variant={t.published ? "default" : "outline"}>{t.published ? "Published" : "Hidden"}</Badge>
              </div>
            </div>
            <p className="mt-2 text-sm">{t.review}</p>
            <form action={deleteTestimonialAction.bind(null, t.id)} className="mt-3">
              <Button size="sm" variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

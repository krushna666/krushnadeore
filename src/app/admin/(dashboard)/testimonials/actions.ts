"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function createTestimonialAction(formData: FormData) {
  await requireUser();
  const clientName = (formData.get("clientName") as string)?.trim();
  const review = (formData.get("review") as string)?.trim();
  if (!clientName || !review) return;

  await prisma.testimonial.create({
    data: {
      clientName,
      review,
      designation: (formData.get("designation") as string) || null,
      company: (formData.get("company") as string) || null,
      project: (formData.get("project") as string) || null,
      rating: formData.get("rating") ? Number(formData.get("rating")) : null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      googleReviewUrl: (formData.get("googleReviewUrl") as string) || null,
      verified: formData.get("verified") === "on",
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
}

export async function deleteTestimonialAction(id: string) {
  await requireUser();
  await prisma.testimonial.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/testimonials");
}

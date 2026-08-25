import { prisma } from "@/lib/db";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { updateMediaAction, deleteMediaAction } from "./actions";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Media Library | OlyxMedia Admin" };

export default async function MediaLibraryPage() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Media Library</h1>
        <p className="text-sm text-muted">Every image needs alt text — required at upload.</p>
      </div>

      <MediaUploadForm />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-2 rounded-xl border border-border p-3">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
              <Image src={item.url} alt={item.alt || ""} fill className="object-cover" unoptimized />
            </div>
            <Input aria-label={`Media URL for ${item.filename}`} value={item.url} readOnly className="h-8 text-xs" />
            <form action={updateMediaAction.bind(null, item.id)} className="space-y-1">
              <Input name="alt" defaultValue={item.alt || ""} placeholder="Alt text" className="h-8 text-xs" />
              <Input name="title" defaultValue={item.title || ""} placeholder="Title" className="h-8 text-xs" />
              <div className="flex gap-1">
                <Button type="submit" size="sm" variant="outline" className="h-7 flex-1 text-xs">
                  Save
                </Button>
              </div>
            </form>
            <form action={deleteMediaAction.bind(null, item.id)}>
              <Button type="submit" size="sm" variant="destructive" className="h-7 w-full text-xs">
                Delete
              </Button>
            </form>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-muted">No media uploaded yet.</p>}
    </div>
  );
}

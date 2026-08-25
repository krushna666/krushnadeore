"use client";

import { useActionState, useState } from "react";
import { savePostAction, type SaveState } from "@/app/admin/(dashboard)/blogs/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/blog/rich-text-editor";
import { slugify } from "@/lib/utils";
import { postStatusValues } from "@/lib/validations/post";

type Option = { id: string; name: string };

export function PostForm({
  post,
  authors,
  categories,
  tags,
  media,
}: {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    status: string;
    authorId: string | null;
    categoryId: string | null;
    tagIds: string[];
    featuredImageId: string | null;
    scheduledAt: Date | null;
    seoTitle: string | null;
    metaDescription: string | null;
    focusKeyword: string | null;
    canonicalUrl: string | null;
    ogImageUrl: string | null;
    robotsNoindex: boolean;
  };
  authors: Option[];
  categories: Option[];
  tags: Option[];
  media: { id: string; url: string; alt: string | null }[];
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(savePostAction, undefined);
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [status, setStatus] = useState(post?.status || "DRAFT");
  const [content, setContent] = useState(post?.content || "");

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-3">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="space-y-4 lg:col-span-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
          <p className="mt-1 text-xs text-muted">/blog/{slug || "your-post-slug"}</p>
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt || ""} rows={2} />
        </div>
        <div>
          <Label>Content</Label>
          <RichTextEditor name="content" value={content} onChange={setContent} />
        </div>

        <div className="rounded-2xl border border-border p-4">
          <h3 className="mb-3 font-semibold">SEO</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle || ""} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea id="metaDescription" name="metaDescription" rows={2} defaultValue={post?.metaDescription || ""} />
            </div>
            <div>
              <Label htmlFor="focusKeyword">Focus keyword</Label>
              <Input id="focusKeyword" name="focusKeyword" defaultValue={post?.focusKeyword || ""} />
            </div>
            <div>
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input id="canonicalUrl" name="canonicalUrl" defaultValue={post?.canonicalUrl || ""} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="ogImageUrl">OG image URL</Label>
              <Input id="ogImageUrl" name="ogImageUrl" defaultValue={post?.ogImageUrl || ""} />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="robotsNoindex" defaultChecked={post?.robotsNoindex} />
              Noindex this post
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border p-4">
          <h3 className="mb-3 font-semibold">Publish</h3>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {postStatusValues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          {status === "SCHEDULED" && (
            <div className="mt-3">
              <Label htmlFor="scheduledAt">Publish at</Label>
              <Input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                defaultValue={post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ""}
              />
            </div>
          )}
          {state?.error && <p className="mt-3 text-sm text-danger">{state.error}</p>}
          <Button type="submit" className="mt-4 w-full" disabled={pending}>
            {pending ? "Saving…" : post?.id ? "Save changes" : "Create post"}
          </Button>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <h3 className="mb-3 font-semibold">Organize</h3>
          <Label htmlFor="authorId">Author</Label>
          <Select id="authorId" name="authorId" defaultValue={post?.authorId || ""}>
            <option value="">— None —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
          <div className="mt-3">
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" name="categoryId" defaultValue={post?.categoryId || ""}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-3">
            <Label htmlFor="tagIds">Tags (ctrl/cmd+click to select multiple)</Label>
            <Select id="tagIds" name="tagIds" multiple defaultValue={post?.tagIds || []} className="h-auto min-h-24">
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mt-3">
            <Label htmlFor="featuredImageId">Featured image</Label>
            <Select id="featuredImageId" name="featuredImageId" defaultValue={post?.featuredImageId || ""}>
              <option value="">— None —</option>
              {media.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.alt || m.url}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </form>
  );
}

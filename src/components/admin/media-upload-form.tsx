"use client";

import { useActionState, useRef } from "react";
import { uploadMediaAction, type UploadState } from "@/app/admin/(dashboard)/media/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function MediaUploadForm() {
  const [state, formAction, pending] = useActionState<UploadState, FormData>(uploadMediaAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-4"
    >
      <div className="md:col-span-1">
        <Label htmlFor="file">File</Label>
        <Input id="file" name="file" type="file" accept="image/*" required />
      </div>
      <div className="md:col-span-1">
        <Label htmlFor="alt">Alt text (required)</Label>
        <Input id="alt" name="alt" required placeholder="e.g. Social media marketing strategy for Pune businesses" />
      </div>
      <div className="md:col-span-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" />
      </div>
      <div className="flex items-end gap-2 md:col-span-1">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {state?.error && <p className="text-sm text-danger md:col-span-4">{state.error}</p>}
    </form>
  );
}

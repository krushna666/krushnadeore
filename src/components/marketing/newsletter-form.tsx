"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction, type NewsletterState } from "@/lib/actions/newsletter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletterAction, undefined);

  if (state?.message) {
    return <p className="text-sm text-foreground">{state.message}</p>;
  }

  return (
    <form action={formAction} className="flex gap-2">
      <Input name="email" type="email" placeholder="Your email" required className="bg-background" />
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "…" : "Subscribe"}
      </Button>
      {state?.error && <p className="text-xs text-danger">{state.error}</p>}
    </form>
  );
}

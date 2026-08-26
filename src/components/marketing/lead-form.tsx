"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { submitLeadAction, type LeadFormState } from "@/lib/actions/leads";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SERVICE_CATALOG } from "@/lib/constants";

export function LeadForm(props: { compact?: boolean; defaultService?: string }) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface" />}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}

function LeadFormInner({ compact = false, defaultService }: { compact?: boolean; defaultService?: string }) {
  const [state, formAction, pending] = useActionState<LeadFormState, FormData>(submitLeadAction, undefined);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot — hidden from real users via CSS, bots fill it */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="companyWebsiteUrl">Leave this field empty</label>
        <input id="companyWebsiteUrl" name="companyWebsiteUrl" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="landingPage" value={pathname} />
      <input type="hidden" name="utm_source" value={searchParams.get("utm_source") || ""} />
      <input type="hidden" name="utm_medium" value={searchParams.get("utm_medium") || ""} />
      <input type="hidden" name="utm_campaign" value={searchParams.get("utm_campaign") || ""} />
      <input type="hidden" name="utm_term" value={searchParams.get("utm_term") || ""} />
      <input type="hidden" name="utm_content" value={searchParams.get("utm_content") || ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name*</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" />
        </div>
        <div>
          <Label htmlFor="phone">Phone*</Label>
          <Input id="phone" name="phone" type="tel" required />
        </div>
        <div>
          <Label htmlFor="email">Email*</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        {!compact && (
          <>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" name="industry" />
            </div>
            <div>
              <Label htmlFor="serviceRequired">Service required</Label>
              <Select id="serviceRequired" name="serviceRequired" defaultValue={defaultService || ""}>
                <option value="">Select a service</option>
                {SERVICE_CATALOG.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Monthly marketing budget</Label>
              <Select id="budget" name="budget" defaultValue="">
                <option value="">Select a range</option>
                <option value="Under ₹25,000">Under ₹25,000</option>
                <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
                <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                <option value="₹1,00,000+">₹1,00,000+</option>
              </Select>
            </div>
          </>
        )}
      </div>

      {!compact && (
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={3} />
        </div>
      )}

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Book a Free Strategy Call"}
      </Button>
      <p className="text-center text-xs text-muted">We typically respond within one business day.</p>
    </form>
  );
}

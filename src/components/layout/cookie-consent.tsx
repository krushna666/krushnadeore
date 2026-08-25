"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getConsent, setConsent } from "@/lib/consent";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Reads localStorage, which isn't available during SSR/first render —
    // this one-shot mount check is the standard pattern for that.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  function acceptAll() {
    setConsent({ analytics: true, marketing: true });
    setVisible(false);
  }

  function rejectOptional() {
    setConsent({ analytics: false, marketing: false });
    setVisible(false);
  }

  function savePreferences() {
    setConsent({ analytics, marketing });
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 mx-auto max-w-xl px-4 md:bottom-4">
      <div className="rounded-2xl border border-border bg-background p-4 shadow-xl">
        <p className="text-sm text-foreground">
          We use cookies for essential site functionality, analytics and marketing. See our{" "}
          <Link href="/cookie-policy" className="text-brand hover:underline">
            Cookie Policy
          </Link>
          .
        </p>

        {customizing && (
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked disabled /> Necessary (always on)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> Analytics
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing
            </label>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={acceptAll}>
            Accept All
          </Button>
          <Button size="sm" variant="outline" onClick={customizing ? savePreferences : rejectOptional}>
            {customizing ? "Save preferences" : "Reject Optional"}
          </Button>
          {!customizing && (
            <Button size="sm" variant="ghost" onClick={() => setCustomizing(true)}>
              Customize
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

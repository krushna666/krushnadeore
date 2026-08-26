"use client";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "olyxmedia_cookie_consent";
export const CONSENT_EVENT = "olyxmedia:consent-changed";

export function getConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentPreferences) : null;
  } catch {
    return null;
  }
}

export function setConsent(prefs: Omit<ConsentPreferences, "necessary" | "decidedAt">) {
  const value: ConsentPreferences = { necessary: true, decidedAt: new Date().toISOString(), ...prefs };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  } catch {
    // localStorage unavailable (private mode etc.) — consent simply won't persist.
  }
  return value;
}

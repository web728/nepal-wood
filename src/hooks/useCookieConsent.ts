"use client";

import { useCallback, useEffect, useState } from "react";

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE_DAYS = 270; // ~9 months, within the 6-12 month range
const LEAD_CACHE_KEY = "nepalwood_lead_cache";

interface CachedLead {
  name?: string;
  email?: string;
  phone?: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/** Called by forms after a successful submission so a returning visitor's
 *  info can be reused when they accept cookies later. */
export function cacheLeadInfo(lead: CachedLead) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(window.localStorage.getItem(LEAD_CACHE_KEY) ?? "{}");
    window.localStorage.setItem(LEAD_CACHE_KEY, JSON.stringify({ ...existing, ...lead }));
  } catch {
    window.localStorage.setItem(LEAD_CACHE_KEY, JSON.stringify(lead));
  }
}

function readCachedLead(): CachedLead {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LEAD_CACHE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function useCookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Cookie value is unknowable at SSR time; checking post-mount (rather
    // than a lazy useState initializer) avoids a hydration mismatch.
    const existing = getCookie(COOKIE_NAME);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (existing === null) setVisible(true);
  }, []);

  const accept = useCallback(async () => {
    setCookie(COOKIE_NAME, "true", COOKIE_MAX_AGE_DAYS);
    setVisible(false);

    const lead = readCachedLead();
    try {
      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentGiven: true, ...lead }),
      });
    } catch (err) {
      console.error("[useCookieConsent] Failed to record consent:", err);
    }
  }, []);

  const reject = useCallback(() => {
    setCookie(COOKIE_NAME, "false", COOKIE_MAX_AGE_DAYS);
    setVisible(false);
    // Per spec: no tracking call is made on rejection.
  }, []);

  return { visible, accept, reject };
}

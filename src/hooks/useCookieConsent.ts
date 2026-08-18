"use client";

import { useCallback, useEffect, useState } from "react";

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE_DAYS = 270; // ~9 months
const LEAD_CACHE_KEY = "nepalwood_lead_cache";

export interface CachedLead {
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

/** Forms use this to store user info in LocalStorage on submission */
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
    const existing = getCookie(COOKIE_NAME);
    if (existing === null) setVisible(true);
  }, []);

  /** Accepts consent and optionally receives direct input details */
  const accept = useCallback(async (manualLead?: CachedLead) => {
    setCookie(COOKIE_NAME, "true", COOKIE_MAX_AGE_DAYS);
    setVisible(false);

    // 1. Read existing cache from forms
    const cachedLead = readCachedLead();

    // 2. Combine cached lead with inputs provided right in the banner (if any)
    const combinedLead: CachedLead = {
      name: manualLead?.name || cachedLead.name,
      email: manualLead?.email || cachedLead.email,
      phone: manualLead?.phone || cachedLead.phone,
    };

    // 3. Update localStorage cache if banner had new info
    if (manualLead?.name || manualLead?.email || manualLead?.phone) {
      cacheLeadInfo(manualLead);
    }

    // 4. Send API call once
    try {
      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentGiven: true, ...combinedLead }),
      });
    } catch (err) {
      console.error("[useCookieConsent] Failed to record consent:", err);
    }
  }, []);

  const reject = useCallback(async (manualLead?: CachedLead) => {
    setCookie(COOKIE_NAME, "false", COOKIE_MAX_AGE_DAYS);
    setVisible(false);

    // Record rejection with identity (optional logging)
    try {
      await fetch("/api/cookie-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentGiven: false, ...manualLead }),
      });
    } catch (err) {
      console.error("[useCookieConsent] Failed to record rejection:", err);
    }
  }, []);

  return { visible, accept, reject };
}
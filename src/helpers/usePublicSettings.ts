"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

/**
 * Public, unauthenticated platform settings -- the single source the
 * buyer/seller apps and website read for contact details, social links and
 * the maintenance banner. Backed by GET /settings/general/public/.
 *
 * Fetched once per browser session and shared across every consumer via a
 * module-level cache, so the footer, contact page, maintenance gate, etc.
 * don't each hit the endpoint. Fail-soft: on any error the hook simply
 * returns null and callers fall back to their built-in copy.
 */
export interface PublicSettings {
  support_email: string;
  general_email: string;
  whatsapp_number: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  postal_code: string;
  map_link: string;
  instagram_url: string;
  twitter_url: string;
  facebook_url: string;
  tiktok_url: string;
  maintenance_mode: boolean;
  maintenance_message: string;
}

let cache: PublicSettings | null = null;
let inflight: Promise<PublicSettings> | null = null;

async function load(): Promise<PublicSettings> {
  if (cache) return cache;
  if (!inflight) {
    inflight = axios
      .get("/settings/general/public/")
      .then((r) => {
        const data = (r.data?.data ?? r.data) as PublicSettings;
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function usePublicSettings(): PublicSettings | null {
  const [settings, setSettings] = useState<PublicSettings | null>(cache);

  useEffect(() => {
    let mounted = true;
    load()
      .then((s) => {
        if (mounted) setSettings(s);
      })
      .catch(() => {
        /* fail-soft: callers use their fallback copy */
      });
    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}

/**
 * Turn a stored link/handle into a safe href. Stored values can be bare
 * ("instagram.com/martaf") since the admin UI accepts them as typed; this
 * prefixes a scheme so the browser treats them as external links.
 */
export function toHref(value?: string | null): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v) || v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  return `https://${v}`;
}

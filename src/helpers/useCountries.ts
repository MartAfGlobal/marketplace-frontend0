"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

/**
 * The managed country list (Settings > Localisation) — the single source for
 * every country dropdown across the apps and website. Fetched once per
 * session, module-cached and shared. Fail-soft: errors return [] so a form
 * never crashes on a country lookup.
 */
export interface ManagedCountry {
  id: string;
  name: string;
  code: string;
  can_ship_to: boolean;
  can_sell_from: boolean;
  default_currency_code: string | null;
  default_language_code: string | null;
}

let cache: ManagedCountry[] | null = null;
let inflight: Promise<ManagedCountry[]> | null = null;

async function load(): Promise<ManagedCountry[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = axios
      .get("/locations/countries/all/")
      .then((r) => {
        const data = (r.data?.results ?? r.data ?? []) as ManagedCountry[];
        cache = data;
        return data;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useCountries(opts?: { sellableOnly?: boolean; shippableOnly?: boolean }) {
  const [all, setAll] = useState<ManagedCountry[]>(cache ?? []);

  useEffect(() => {
    let mounted = true;
    load()
      .then((d) => mounted && setAll(d))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  let countries = all;
  if (opts?.sellableOnly) countries = countries.filter((c) => c.can_sell_from);
  if (opts?.shippableOnly) countries = countries.filter((c) => c.can_ship_to);
  return { countries };
}

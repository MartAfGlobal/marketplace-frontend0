"use client";

import { useState, useEffect, useRef } from "react";
import axios from "@/lib/axios";

// Baseline suggestions matching sample UI and common African marketplace items
const FALLBACK_SUGGESTIONS = [
  "Hello",
  "He curles bag",
  "Headphones",
  "Handbag",
  "Heater",
  "Helmet",
  "Hoodie",
  "Heels",
  "Umbrella",
  "Ankara shoes",
  "Opener",
  "red skirt",
  "Donkito",
  "Red shoes",
  "Ankara handkerchief",
  "Sandals",
  "Air diffuser",
  "Wild coit Bakhur",
  "Vanilla Vogage",
  "Phone",
  "Phone case",
  "Sneakers",
  "Smart watch",
  "Laptop",
];

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    // Immediately show matching fallback items for instant responsiveness
    const lower = trimmed.toLowerCase();
    const immediateMatches = FALLBACK_SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(lower)
    );
    setSuggestions(immediateMatches);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `/products/public/products/?search=${encodeURIComponent(trimmed)}&page=1&page_size=10`
        );
        const results = response?.data?.results || [];
        const apiNames: string[] = results
          .map((p: any) => p?.name)
          .filter(Boolean);

        // Merge API names first, then fallback matches
        const combined = Array.from(
          new Set([...apiNames, ...immediateMatches])
        ).slice(0, 10);

        setSuggestions(combined);
      } catch (err) {
        // Keep fallback matches if API fails
        console.error("Search suggestion error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  return { suggestions, loading };
}

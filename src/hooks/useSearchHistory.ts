"use client";

import { useState, useEffect, useCallback } from "react";

const HISTORY_KEY = "martaf_search_history";
const FREQUENT_KEY = "martaf_frequently_searched";
const SYNC_EVENT = "martaf_search_history_updated";

const DEFAULT_HISTORY = [
  "Umbrella",
  "Ankara shoes",
  "Opener",
  "red skirt",
];

const DEFAULT_FREQUENT = [
  "Donkito",
  "Red shoes",
  "Ankara handkerchief",
  "Ankara shoes",
];

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [frequent, setFrequent] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      } else {
        setHistory(DEFAULT_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
      }

      const storedFrequent = localStorage.getItem(FREQUENT_KEY);
      if (storedFrequent) {
        setFrequent(JSON.parse(storedFrequent));
      } else {
        setFrequent(DEFAULT_FREQUENT);
        localStorage.setItem(FREQUENT_KEY, JSON.stringify(DEFAULT_FREQUENT));
      }
    } catch {
      setHistory(DEFAULT_HISTORY);
      setFrequent(DEFAULT_FREQUENT);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    const handleSync = () => {
      loadFromStorage();
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadFromStorage]);

  const dispatchSync = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(SYNC_EVENT));
    }
  };

  const addToHistory = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...filtered].slice(0, 15);
      if (typeof window !== "undefined") {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        dispatchSync();
      }
      return updated;
    });
  }, []);

  const removeHistoryItem = useCallback((term: string) => {
    setHistory((prev) => {
      const updated = prev.filter(
        (item) => item.toLowerCase() !== term.toLowerCase()
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        dispatchSync();
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
      dispatchSync();
    }
  }, []);

  const removeFrequentItem = useCallback((term: string) => {
    setFrequent((prev) => {
      const updated = prev.filter(
        (item) => item.toLowerCase() !== term.toLowerCase()
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(FREQUENT_KEY, JSON.stringify(updated));
        dispatchSync();
      }
      return updated;
    });
  }, []);

  const clearFrequent = useCallback(() => {
    setFrequent([]);
    if (typeof window !== "undefined") {
      localStorage.setItem(FREQUENT_KEY, JSON.stringify([]));
      dispatchSync();
    }
  }, []);

  return {
    history,
    frequent,
    isLoaded,
    addToHistory,
    removeHistoryItem,
    clearHistory,
    removeFrequentItem,
    clearFrequent,
  };
}

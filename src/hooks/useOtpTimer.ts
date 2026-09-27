"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseOtpTimerOptions {
  /** Unique key prefix to scope this timer in sessionStorage, e.g. "reset_password" */
  scope: string;
  /** Identifier (e.g. email or userId). If changed, a separate timer is tracked */
  identifier?: string;
  /** Initial cooldown in seconds when no previous session timestamp exists */
  initialSeconds?: number;
}

/** Check whether an error response from the backend indicates that the OTP has expired */
export function isOtpExpiredError(err: any): boolean {
  if (!err) return false;
  const data = err?.response?.data || err?.data || err;
  const text = typeof data === "string" ? data : JSON.stringify(data);
  return /expired/i.test(text);
}

export function useOtpTimer({
  scope,
  identifier = "default",
  initialSeconds = 120,
}: UseOtpTimerOptions) {
  // Normalize identifier to avoid invalid characters in storage key
  const safeIdentifier = encodeURIComponent(identifier || "default");
  const storageKey = `otp_expiry_${scope}_${safeIdentifier}`;

  // Helper to read remaining seconds based on the stored absolute timestamp
  const getRemainingFromStorage = useCallback((): number => {
    if (typeof window === "undefined") return initialSeconds;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return 0;
      const expiry = Number(stored);
      if (!expiry || isNaN(expiry)) return 0;
      const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
      return remaining;
    } catch {
      return 0;
    }
  }, [storageKey, initialSeconds]);

  const [timer, setTimer] = useState<number>(() => {
    if (typeof window === "undefined") return initialSeconds;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) {
        const expiry = Number(stored);
        if (expiry && !isNaN(expiry)) {
          // If stored timestamp exists, compute actual remaining seconds
          return Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
        }
      }
      // No stored timestamp yet: initialize storage with initialSeconds
      if (initialSeconds > 0) {
        sessionStorage.setItem(storageKey, String(Date.now() + initialSeconds * 1000));
      }
      return initialSeconds;
    } catch {
      return initialSeconds;
    }
  });

  // Re-sync timer if identifier or initialSeconds changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored !== null) {
        const expiry = Number(stored);
        if (expiry && !isNaN(expiry)) {
          setTimer(Math.max(0, Math.ceil((expiry - Date.now()) / 1000)));
          return;
        }
      }
      if (initialSeconds > 0) {
        sessionStorage.setItem(storageKey, String(Date.now() + initialSeconds * 1000));
      }
      setTimer(initialSeconds);
    } catch {
      setTimer(initialSeconds);
    }
  }, [storageKey, initialSeconds]);

  // Start or reset the timer with a new duration (in seconds)
  const resetTimer = useCallback(
    (seconds: number) => {
      const validSeconds = Math.max(0, Number(seconds) || 0);
      if (typeof window !== "undefined") {
        try {
          if (validSeconds > 0) {
            sessionStorage.setItem(storageKey, String(Date.now() + validSeconds * 1000));
          } else {
            sessionStorage.removeItem(storageKey);
          }
        } catch {
          // sessionStorage may fail in private mode
        }
      }
      setTimer(validSeconds);
    },
    [storageKey]
  );

  // Expire the timer immediately (e.g. when backend says "OTP expired")
  const expireTimer = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
    setTimer(0);
  }, [storageKey]);

  // Keep countdown in sync with wall-clock time
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      const remaining = getRemainingFromStorage();
      setTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (typeof window !== "undefined") {
          try {
            sessionStorage.removeItem(storageKey);
          } catch {
            // ignore
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, storageKey, getRemainingFromStorage]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const canResend = timer <= 0;

  return {
    timer,
    setTimer,
    resetTimer,
    expireTimer,
    formattedTimer,
    canResend,
    minutes,
    seconds,
  };
}

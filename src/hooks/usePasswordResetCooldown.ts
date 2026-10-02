"use client";

import { useCallback } from "react";
import { useOtpTimer } from "@/hooks/useOtpTimer";

const FIRST_RESEND_DELAY = 2 * 60;
const LATER_RESEND_DELAY = 6 * 60;

export function usePasswordResetCooldown(
  userType: "buyer" | "seller",
  email: string,
) {
  const identifier = `${userType}:${email.trim().toLowerCase() || "default"}`;
  const { timer, resetTimer } = useOtpTimer({
    scope: "password_reset_resend",
    identifier,
    initialSeconds: 0,
  });

  const recordSuccessfulSend = useCallback(() => {
    const attemptsKey = `password_reset_send_count_${encodeURIComponent(identifier)}`;
    let successfulSendCount = 0;

    if (typeof window !== "undefined") {
      try {
        successfulSendCount = Number(sessionStorage.getItem(attemptsKey)) || 0;
        sessionStorage.setItem(attemptsKey, String(successfulSendCount + 1));
      } catch {
        // Keep the cooldown active if session storage is unavailable.
      }
    }

    resetTimer(successfulSendCount === 0 ? FIRST_RESEND_DELAY : LATER_RESEND_DELAY);
  }, [identifier, resetTimer]);

  return { timer, recordSuccessfulSend };
}
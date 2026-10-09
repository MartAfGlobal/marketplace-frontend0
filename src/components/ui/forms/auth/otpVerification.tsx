"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import { useOtpTimer, isOtpExpiredError } from "@/hooks/useOtpTimer";

const DEFAULT_RESEND_TIMEOUT = 120;

function extractRetryAfter(data: any): number | null {
  const raw =
    data?.retry_after ??
    data?.retry_after_seconds ??
    data?.resend_after ??
    data?.cooldown ??
    data?.wait_seconds ??
    data?.expires_in ??
    null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function OtpVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const initialRetryAfter =
    extractRetryAfter({
      retry_after: searchParams.get("retry_after"),
      retry_after_seconds: searchParams.get("retry_after_seconds"),
      resend_after: searchParams.get("resend_after"),
      cooldown: searchParams.get("cooldown"),
    }) ?? DEFAULT_RESEND_TIMEOUT;

  const OTP_LENGTH = 6;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { timer, resetTimer, expireTimer, formattedTimer } = useOtpTimer({
    scope: "buyer_reset_password",
    identifier: email,
    initialSeconds: initialRetryAfter,
  });

  const { loading, sendHttpRequest: verifyOtp } = useHttp();
  const { loading: resendLoading, sendHttpRequest: resendOtp } = useHttp();

  // Clipboard paste suggestion
  const [clipboardOtp, setClipboardOtp] = useState<string | null>(null);
  const lastCheckedClip = useRef<string>("");

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (
        numeric.length === OTP_LENGTH &&
        numeric !== lastCheckedClip.current
      ) {
        lastCheckedClip.current = numeric;
        setClipboardOtp(numeric);
      } else if (numeric.length !== OTP_LENGTH) {
        // Clear suggestion if clipboard no longer has a valid OTP
        setClipboardOtp(null);
      }
    } catch {
      // Clipboard permission denied or unavailable — silent fail
    }
  }, []);

  // Check clipboard on mount and whenever window regains focus
  useEffect(() => {
    checkClipboard();
    window.addEventListener("focus", checkClipboard);
    return () => window.removeEventListener("focus", checkClipboard);
  }, [checkClipboard]);

  const applyClipboardOtp = () => {
    if (!clipboardOtp) return;
    const next = Array(OTP_LENGTH).fill("");
    clipboardOtp.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    setClipboardOtp(null);
    lastCheckedClip.current = "";
    const focusIndex = Math.min(clipboardOtp.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    handleSubmit(undefined, clipboardOtp);
  };

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH && digits.every((d) => d !== "");

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDirectPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (numeric.length > 0) {
        const next = Array(OTP_LENGTH).fill("");
        numeric.split("").forEach((ch, i) => {
          next[i] = ch;
        });
        setDigits(next);
        setClipboardOtp(null);
        lastCheckedClip.current = "";
        const focusIndex = Math.min(numeric.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
        toast.success("Code pasted from clipboard");
        if (numeric.length === OTP_LENGTH) handleSubmit(undefined, numeric);
      } else {
        toast.error("No code found in clipboard");
      }
    } catch {
      toast.error("Clipboard access denied. Please paste into the box.");
    }
  };

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (
      cleaned.length >= OTP_LENGTH ||
      (cleaned.length > 1 && !digits[index])
    ) {
      const next = [...digits];
      const pasted = (
        cleaned.length > OTP_LENGTH ? cleaned.slice(-OTP_LENGTH) : cleaned
      ).slice(0, OTP_LENGTH);
      pasted.split("").forEach((ch, i) => {
        next[i] = ch;
      });
      setDigits(next);
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    // Allow only single digit
    const digit = cleaned.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
     setErrorMsg(null);

    // Move to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent, otpValue = otp) => {
    e?.preventDefault();
    if (otpValue.length !== OTP_LENGTH) {
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    if (!email) {
      toast.error("Missing email address. Please start again.");
      router.push("/auth/forgot-password");
      return;
    }
   

    verifyOtp({
      successRes: (res: any) => {
        const data = res?.data || res;
        const resetToken = data?.token;
        if (resetToken) {
          expireTimer();
          toast.success(data?.detail || "Code verified successfully.");
          router.push(
            `/auth/create-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`,
          );
        } else {
          toast.error(data?.detail || "Code verification failed.");
        }
      },
      errorRes: (err: any) => {
        if (isOtpExpiredError(err)) {
          expireTimer();
          setDigits(Array(OTP_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        }
      },
      requestConfig: {
        url: "/accounts/reset-password/verify-otp/",
        method: "POST",
        body: { email, otp: otpValue },
        userType: "buyer",
      },
    });
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    if (pasted.length === OTP_LENGTH) handleSubmit(undefined, pasted);
  };

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || timer > 0) return;

    resendOtp({
      successRes: (res: any) => {
        toast.success("OTP resent to your email.");
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        const backendRetry =
          extractRetryAfter(res?.data) ??
          extractRetryAfter(res) ??
          DEFAULT_RESEND_TIMEOUT;
        resetTimer(backendRetry);
      },
      errorRes: (err: any) => {
        const backendRetry = extractRetryAfter(err?.response?.data);
        if (backendRetry) {
          resetTimer(backendRetry);
        }
      },
      requestConfig: {
        url: "/accounts/reset-password/",
        method: "POST",
        body: { email },
        userType: "buyer",
        successMessage: "OTP resent successfully.",
      },
    });
  };

  return (
    <div className="w-full">
      {/* Email hint */}
       <p className="text-base font-MontserratSemiBold text-center mt-3 mb-8 text-161616 break-all">
        {email}
      </p>

      {/* Error message */}
      {errorMsg && (
        <p className="text-red-500 font-MontserratSemiBold text-sm mb-4 text-center">
          {errorMsg}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-c32"
      >
        {/* Clipboard paste suggestion banner */}

        {/* OTP digit boxes */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-3 justify-center">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={OTP_LENGTH}
                value={digit}
                onFocus={() => {
                  checkClipboard();
                }}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${i + 1}`}
               className="w-full max-w-[47.33px] h-c64 md:w-c56 text-center text-xl font-MontserratBold border border-efefef rounded-c8 p-0 focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none transition-all"
          
              />
            ))}
          </div>
          {clipboardOtp && (
            <button
              type="button"
              onClick={handleDirectPaste}
              className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-MontserratMedium text-ff715b hover:text-ff715b/80 transition-colors py-1 px-2.5 rounded-full hover:bg-ff715b/5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Paste code from clipboard
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isComplete || loading}
          className="w-full"
        >
          {loading ? <LoadingSpinner /> : "Verify OTP"}
        </Button>
      </form>

      {/* Resend */}
      <div className="flex flex-col items-center gap-2 mt-c24 font-MontserratMedium text-c12">
        <Button
          variant="secondary"
          onClick={handleResend}
          disabled={resendLoading || timer > 0}
          className=""
        >
          {resendLoading
            ? "Resending…"
            : timer > 0
              ? `Resend OTP in (${formattedTimer})`
              : "Resend OTP"}
        </Button>
        <Link
          href="/auth/login"
          className="text-161616/60 hover:text-ff715b transition-colors"
        >
          Return to login
        </Link>
      </div>
    </div>
  );
}

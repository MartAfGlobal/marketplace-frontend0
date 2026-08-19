"use client";

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";

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

  const initialRetryAfter =
    extractRetryAfter({
      retry_after: searchParams.get("retry_after"),
      retry_after_seconds: searchParams.get("retry_after_seconds"),
      resend_after: searchParams.get("resend_after"),
      cooldown: searchParams.get("cooldown"),
    }) ?? DEFAULT_RESEND_TIMEOUT;

  const OTP_LENGTH = 6;
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(initialRetryAfter);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { loading, sendHttpRequest: verifyOtp } = useHttp();
  const { loading: resendLoading, sendHttpRequest: resendOtp } = useHttp();

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH && digits.every((d) => d !== "");

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Allow only single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

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

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      toast.error("Please enter the full 6-digit OTP.");
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
          toast.success(data?.detail || "Code verified successfully.");
          router.push(
            `/auth/create-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`
          );
        } else {
          toast.error(data?.detail || "Code verification failed.");
        }
      },
      requestConfig: {
        url: "/accounts/reset-password/verify-otp/",
        method: "POST",
        body: { email, otp },
        userType: "buyer",
      },
    });
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
        setTimer(backendRetry);
      },
      errorRes: (err: any) => {
        const backendRetry = extractRetryAfter(err?.response?.data);
        if (backendRetry) {
          setTimer(backendRetry);
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

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="w-full">
      {/* Email hint */}
      <p className="text-center font-MontserratMedium text-c12 text-161616 mb-c32">
        Enter the 6-digit code sent to{" "}
        <span className="font-MontserratSemiBold text-ff715b break-all">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-c32">
        {/* OTP digit boxes */}
        <div className="flex gap-3 justify-center">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`OTP digit ${i + 1}`}
              className={`
                w-12 h-14 text-center text-c18 font-MontserratSemiBold rounded-lg border-2
                outline-none transition-all duration-200
                ${digit
                  ? "border-ff715b bg-ff715b/5 text-161616"
                  : "border-efefef bg-white text-161616"
                }
                focus:border-ff715b focus:ring-2 focus:ring-ff715b/20
                caret-ff715b
              `}
            />
          ))}
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
        <button
          onClick={handleResend}
          disabled={resendLoading || timer > 0}
          className="text-ff715b hover:underline disabled:opacity-50 transition-opacity"
        >
          {resendLoading
            ? "Resending…"
            : timer > 0
            ? `Resend OTP in (${formattedTimer})`
            : "Resend OTP"}
        </button>
        <Link href="/auth/login" className="text-161616/60 hover:text-ff715b transition-colors">
          Return to login
        </Link>
      </div>
    </div>
  );
}

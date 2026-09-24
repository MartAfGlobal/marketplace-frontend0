"use client";

import { useRef, useState, useEffect, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { tokenActions } from "@/store/token/token-slice";

const OTP_LENGTH = 6;
const DEFAULT_RESEND_TIMEOUT = 300;

// Step 2 — departments/staff-management/accept-invite/verify-otp/ is what
// actually activates the account (is_active=True, StaffProfile ACTIVE,
// invitation marked accepted) and returns an access token, so success here
// logs the staff member straight in before handing off to the "Registration
// complete" screen.
export default function VerifyOtpForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const initialRetryAfter = Number(searchParams.get("retry_after_seconds")) || DEFAULT_RESEND_TIMEOUT;

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(initialRetryAfter);
  const [wrongCode, setWrongCode] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { loading, sendHttpRequest: verifyOtp } = useHttp();
  const { loading: resendLoading, sendHttpRequest: resendOtp } = useHttp();

  // Clipboard paste suggestion
  const [clipboardOtp, setClipboardOtp] = useState<string | null>(null);
  const lastCheckedClip = useRef<string>("");

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (numeric.length === OTP_LENGTH && numeric !== lastCheckedClip.current) {
        lastCheckedClip.current = numeric;
        setClipboardOtp(numeric);
      } else if (numeric.length !== OTP_LENGTH) {
        setClipboardOtp(null);
      }
    } catch {
      // Silent fail if permission not granted
    }
  }, []);

  useEffect(() => {
    checkClipboard();
    window.addEventListener("focus", checkClipboard);
    return () => window.removeEventListener("focus", checkClipboard);
  }, [checkClipboard]);

  const applyClipboardOtp = () => {
    if (!clipboardOtp) return;
    const next = Array(OTP_LENGTH).fill("");
    clipboardOtp.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    setWrongCode(false);
    setClipboardOtp(null);
    lastCheckedClip.current = "";
    const focusIndex = Math.min(clipboardOtp.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleDirectPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (numeric.length > 0) {
        const next = Array(OTP_LENGTH).fill("");
        numeric.split("").forEach((ch, i) => { next[i] = ch; });
        setDigits(next);
        setWrongCode(false);
        setClipboardOtp(null);
        lastCheckedClip.current = "";
        const focusIndex = Math.min(numeric.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
        toast.success("Code pasted from clipboard");
      } else {
        toast.error("No code found in clipboard");
      }
    } catch {
      toast.error("Clipboard access denied. Please paste into the box.");
    }
  };

  const otp = digits.join("");
  const isComplete = otp.length === OTP_LENGTH && digits.every((d) => d !== "");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= OTP_LENGTH || (cleaned.length > 1 && !digits[index])) {
      const next = [...digits];
      const pasted = (cleaned.length > OTP_LENGTH ? cleaned.slice(-OTP_LENGTH) : cleaned).slice(0, OTP_LENGTH);
      pasted.split("").forEach((ch, i) => {
        next[i] = ch;
      });
      setDigits(next);
      setWrongCode(false);
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setWrongCode(false);

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
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    setWrongCode(false);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }
    if (!email) {
      toast.error("Missing email address. Please use the link from your invite email.");
      return;
    }

    verifyOtp({
      requestConfig: {
        url: "/departments/staff-management/accept-invite/verify-otp/",
        method: "POST",
        body: { email, otp },
        userType: "admin",
      },
      successRes: (res: any) => {
        const data = res?.data ?? res;
        const accessToken = data?.access;
        if (accessToken && typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          dispatch(tokenActions.setToken(accessToken));
        }
        router.push(`/auth/admin/staff/accept-invite/success?email=${encodeURIComponent(email)}`);
      },
      errorRes: () => {
        setWrongCode(true);
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      },
    });
  };

  const handleResend = () => {
    if (!email || timer > 0) return;

    resendOtp({
      requestConfig: {
        url: "/departments/staff-management/accept-invite/resend-otp/",
        method: "POST",
        body: { email },
        userType: "admin",
        successMessage: "A new code has been sent.",
      },
      successRes: (res: any) => {
        const data = res?.data ?? res;
        setDigits(Array(OTP_LENGTH).fill(""));
        setWrongCode(false);
        inputRefs.current[0]?.focus();
        setTimer(Number(data?.retry_after_seconds) || DEFAULT_RESEND_TIMEOUT);
      },
    });
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="w-full">
      <p className="text-center font-MontserratBold text-c16 text-161616 break-all mb-2">{email}</p>

      {wrongCode && (
        <p className="text-center text-ff715b font-MontserratMedium text-c12 mb-2">Wrong Code, Try again.</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-c32">
        {/* Clipboard paste suggestion banner */}
        {clipboardOtp && (
          <div className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-ff715b/10 border border-ff715b/30 animate-in fade-in slide-in-from-top-2 duration-200">
            <svg className="w-4 h-4 text-ff715b shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="flex-1 text-c12 font-MontserratMedium text-161616">
              OTP code copied — paste it?
            </span>
            <button
              type="button"
              onClick={applyClipboardOtp}
              className="text-c12 font-MontserratSemiBold text-ff715b hover:underline shrink-0"
            >
              Paste OTP
            </button>
            <button
              type="button"
              onClick={() => { setClipboardOtp(null); lastCheckedClip.current = ""; }}
              aria-label="Dismiss"
              className="text-161616/40 hover:text-161616 transition-colors ml-1 shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

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
                className={`
                  w-12 h-14 text-center text-c18 font-MontserratSemiBold rounded-lg border-2
                  outline-none transition-all duration-200
                  ${
                    wrongCode
                      ? "border-red-500 bg-red-50 text-161616"
                      : digit
                      ? "border-ff715b bg-ff715b/5 text-161616"
                      : "border-efefef bg-white text-161616"
                  }
                  focus:border-ff715b focus:ring-2 focus:ring-ff715b/20
                  caret-ff715b
                `}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleDirectPaste}
            className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-MontserratMedium text-ff715b hover:text-ff715b/80 transition-colors py-1 px-2.5 rounded-full hover:bg-ff715b/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Paste code from clipboard
          </button>
        </div>

        <div className="flex gap-4 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={handleResend}
            disabled={resendLoading || timer > 0}
            className="flex-1"
          >
            {resendLoading ? <LoadingSpinner color="border-ff715b" /> : timer > 0 ? `Resend OTP (${formattedTimer})` : "Resend OTP"}
          </Button>
          <Button type="submit" disabled={!isComplete || loading} className="flex-1">
            {loading ? <LoadingSpinner /> : "Verify"}
          </Button>
        </div>
      </form>

      <p className="text-center text-c12 font-MontserratNormal text-000000/44 mt-c24">
        If you haven&apos;t received the email, check your spam folder
      </p>
    </div>
  );
}

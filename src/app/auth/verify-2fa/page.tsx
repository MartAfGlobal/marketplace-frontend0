"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import { useHttp } from "@/hooks/use-http";
import { tokenActions } from "@/store/token/token-slice";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Extract retry_after from any response shape the backend might use. */
function extractRetryAfter(data: any): number | null {
  const raw =
    data?.retry_after ??
    data?.resend_after ??
    data?.cooldown ??
    data?.wait_seconds ??
    data?.expires_in ??
    null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatTimer(time: number): string {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// ── Main component ────────────────────────────────────────────────────────────
function Verify2faContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const userId = searchParams.get("user_id") || "";
  const email = searchParams.get("email") || "";
  const userType = searchParams.get("userType") || "seller";

  // Prefer the backend-supplied retry_after from the URL (set when navigating here
  // after login); fall back to 300 s if absent.
  const initialRetryAfter = Number(searchParams.get("retry_after") || "300");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(initialRetryAfter);
  const [canResend, setCanResend] = useState(initialRetryAfter <= 0);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { sendHttpRequest } = useHttp();

  // Sync if the URL param ever changes (e.g. back/forward navigation)
  useEffect(() => {
    setTimer(initialRetryAfter);
    setCanResend(initialRetryAfter <= 0);
  }, [initialRetryAfter]);

  // Countdown tick
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ── OTP input handlers ──────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMsg(null);
    if (value && index < 5) {
      document.getElementById(`page-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`page-otp-${index - 1}`)?.focus();
    }
  };

  // ── Verify ──────────────────────────────────────────────────────────────────
  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifying(true);
    sendHttpRequest({
      requestConfig: {
        url: "/accounts/login/verify-otp/",
        method: "POST",
        body: {
          user_id: userId,
          otp: otpString,
          code: otpString,
        },
      },
      successRes: (res: any) => {
        setVerifying(false);
        const accessToken = res?.data?.access || res?.data?.token || res?.data?.accessToken;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          dispatch(tokenActions.setToken(accessToken));
          toast.success("Login successful!");
          if (userType === "admin") {
            router.push("/info/manager/update");
          } else if (userType === "seller") {
            const redirectUrl = localStorage.getItem("sellerRedirectUrl");
            if (redirectUrl) {
              localStorage.removeItem("sellerRedirectUrl");
              router.push(redirectUrl);
            } else {
              router.push("/dashboard/seller/overview");
            }
          } else {
            router.push("/");
          }
        } else {
          setErrorMsg("Login verification succeeded, but no token was returned.");
        }
      },
      errorRes: (err: any) => {
        setVerifying(false);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Wrong Code, Try again."
        );
      },
    });
  };

  // ── Resend — uses backend retry_after ──────────────────────────────────────
  const handleResendOtp = () => {
    if (!canResend) return;
    setResending(true);
    setErrorMsg(null);

    sendHttpRequest({
      requestConfig: {
        url: "/accounts/login/resend-otp/",
        method: "POST",
        body: { user_id: userId },
      },
      successRes: (res: any) => {
        setResending(false);

        // ── Use the backend's retry_after if provided; fall back to 300 s ──
        const backendRetryAfter = extractRetryAfter(res?.data) ?? 300;
        setTimer(backendRetryAfter);
        setCanResend(false);

        toast.success("A new 2FA code has been sent.");
      },
      errorRes: (err: any) => {
        setResending(false);
        const backendRetry = extractRetryAfter(err?.response?.data);
        if (backendRetry) {
          setTimer(backendRetry);
          setCanResend(false);
        }
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to resend code. Please go back to login and try again.";
        setErrorMsg(msg);
      },
    });
  };

  return (
    <AuthenticationLayout
      userType={userType as any}
      title="Enter OTP"
      description="We've sent a 6-digit code to your email. Enter it below to continue."
    >
      <div className="w-full flex flex-col items-center">
        {email && (
          <p className="text-sm font-MontserratBold text-[#161616] mb-4 break-all text-center">
            {email}
          </p>
        )}

        {errorMsg && (
          <p className="text-red-500 font-MontserratSemiBold text-sm mb-6 text-center">
            {errorMsg}
          </p>
        )}

        {/* OTP Inputs */}
        <div className="flex justify-center mb-8 gap-3 w-full max-w-[360px]">
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              id={`page-otp-${idx}`}
              type="text"
              maxLength={1}
              value={digit}
              disabled={verifying}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className="w-full aspect-square text-center text-xl font-MontserratBold border border-[#EFEFEF] rounded-lg p-0 focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none transition-all"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[360px] mb-6">
          <Button
            variant="secondary"
            onClick={handleResendOtp}
            disabled={!canResend || resending || verifying}
            className="w-full py-4 text-sm font-MontserratSemiBold border border-ff715b text-ff715b hover:bg-ff715b/5 bg-transparent"
          >
            {resending ? (
              <LoadingSpinner color="border-ff715b" />
            ) : timer > 0 ? (
              `Resend OTP (${formatTimer(timer)})`
            ) : (
              "Resend OTP"
            )}
          </Button>
          <Button
            onClick={handleVerifyOtp}
            disabled={verifying || otp.some((d) => d === "")}
            className="w-full py-4 text-sm font-MontserratSemiBold bg-ff715b text-white hover:bg-ff715b/90 transition-colors"
          >
            {verifying ? <LoadingSpinner /> : "Verify"}
          </Button>
        </div>

        <div className="text-center mt-4">
          <Link
            href={userType === "seller" ? "/auth/seller/login" : "/auth/login"}
            className="text-sm font-MontserratSemiBold text-ff715b hover:underline"
          >
            Back to login
          </Link>
        </div>

        <p className="text-xs text-000000/44 font-MontserratMedium text-center leading-relaxed mt-8">
          If you haven't received the email, check your spam folder
        </p>
      </div>
    </AuthenticationLayout>
  );
}

export default function Verify2faPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center font-MontserratMedium">
          Loading...
        </div>
      }
    >
      <Verify2faContent />
    </Suspense>
  );
}

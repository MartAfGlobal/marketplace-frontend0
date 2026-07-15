"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../../loading-spinner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/forms/Input";
import { registrationActions } from "@/store/auth/registration-slice";
import { useDispatch } from "react-redux";

export interface RegProps {
  userType: "seller" | "buyer";
}

const RESEND_TIMEOUT = 120; // 2 minutes in seconds

export default function VerificationEmailSent({ userType }: RegProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  /* ===============================
     OTP STATE
  =============================== */
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ===============================
     TIMER STATE
  =============================== */
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  /* ===============================
     OTP INPUT HANDLERS
  =============================== */
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMsg(null);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reg-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus the last filled input
    const lastIndex = Math.min(pasted.length - 1, 5);
    document.getElementById(`reg-otp-${lastIndex}`)?.focus();
  };

  /* ===============================
     CONFIRM OTP
  =============================== */
  const { loading: verifying, sendHttpRequest: confirmOtpReq } = useHttp();

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code.");
      return;
    }

    confirmOtpReq({
      requestConfig: {
        url: "/accounts/register/verify-otp/",
        method: "POST",
        body: {
          email,
          otp: otpString,
        },
        userType,
      },
      successRes: (res: any) => {
        console.log("tokebn email", res)
        // The backend may return a token to continue registration
        const token =
          res?.data?.token

        if (token) {
          dispatch(registrationActions.setToken(token));
          // Navigate to the registration form that uses the token
          if (userType === "buyer") {
            router.push(`/auth/buyer/sign-up/verify-email/${token}`);
          } else {
            router.push(`/auth/seller/sign-up/registeration-step1/${token}`);
          }
        } else {
          // Fallback: navigate without token if already set elsewhere
          toast.success("Email verified! Please complete your registration.");
          if (userType === "buyer") {
            router.push(`/auth/buyer/sign-up/verify-email/${otpString}`);
          } else {
            router.push(`/auth/seller/sign-up/registeration-step1/${otpString}`);
          }
        }
      },
      errorRes: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.otp?.[0] ||
          "Invalid or expired code. Please try again.";
        setErrorMsg(msg);
      },
    });
  };

  /* ===============================
     RESEND OTP
  =============================== */
  const { loading: resending, sendHttpRequest: resendOtpReq } = useHttp();

  const handleResendOtp = () => {
    if (secondsLeft > 0) return;

    setErrorMsg(null);
    resendOtpReq({
      requestConfig: {
        url: "/accounts/register/resend-otp/",
        method: "POST",
        body: { email },
        userType,
      },
      successRes: () => {
        toast.success("A new verification code has been sent to your email.");
        setOtp(["", "", "", "", "", ""]);
        setSecondsLeft(RESEND_TIMEOUT);
        document.getElementById("reg-otp-0")?.focus();
      },
      errorRes: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to resend code. Please try again.";
        setErrorMsg(msg);
      },
    });
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <div className="w-full flex flex-col items-center">
      {/* Email display */}
      <p className="text-base font-MontserratSemiBold text-center mt-c8 mb-6 text-161616 break-all">
        {email}
      </p>

      {/* Error message */}
      {errorMsg && (
        <p className="text-red-500 font-MontserratSemiBold text-sm mb-4 text-center">
          {errorMsg}
        </p>
      )}

      {/* OTP Inputs */}
      <div className="flex justify-center mb-6 gap-3 w-full max-w-[360px]">
        {otp.map((digit, idx) => (
          <Input
            key={idx}
            id={`reg-otp-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={verifying}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            onPaste={idx === 0 ? handleOtpPaste : undefined}
            className="w-full aspect-square text-center text-xl font-MontserratBold border border-efefef rounded-lg p-0 focus:border-ff715b focus:ring-1 focus:ring-ff715b outline-none transition-all"
          />
        ))}
      </div>

      {/* Verify Button */}
      <div className="w-full max-w-[360px] mb-4">
        <Button
          onClick={handleVerifyOtp}
          disabled={verifying || !isOtpComplete}
        >
          {verifying ? <LoadingSpinner /> : "Verify Code"}
        </Button>
      </div>

      {/* Resend Button */}
      <div className="w-full max-w-[360px] mb-6">
        <Button
          onClick={handleResendOtp}
          disabled={secondsLeft > 0 || resending || verifying}
          className="text-ff715b bg-transparent border border-ff715b hover:bg-ff715b/5 disabled:opacity-50 text-sm font-MontserratSemiBold"
        >
          {resending ? (
            <LoadingSpinner color="border-ff715b" />
          ) : secondsLeft > 0 ? (
            `Resend code in ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          ) : (
            "Resend code"
          )}
        </Button>
      </div>

      {/* Footer */}
      <div className="font-MontserratMedium text-c12 justify-center mt-2 px-c42">
        <p className="text-161616 text-center">
          Wrong email?{" "}
          <Link
            href={userType === "buyer" ? "/auth/buyer/sign-up" : "/auth/seller/sign-up"}
            className="text-ff715b"
          >
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}

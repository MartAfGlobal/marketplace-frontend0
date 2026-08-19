"use client";

import { useHttp } from "@/hooks/use-http";
import { MobileLoginProps } from "@/types/global";
import { toast } from "sonner";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/forms/Input";
import { useRouter } from "next/navigation";

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

const DEFAULT_RESET_TIMEOUT = 120;

export default function ResetVerify({
  onClose,
  setStep,
  email,
}: MobileLoginProps) {
  const { loading, sendHttpRequest: resendUserReq } = useHttp();
  const { loading: verifying, sendHttpRequest: verifyOtpReq } = useHttp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(DEFAULT_RESET_TIMEOUT);
  const router = useRouter();

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please start again.");
      setStep("forgot");
      return;
    }

    verifyOtpReq({
      successRes: (res: any) => {
        const data = res?.data || res;
        const resetToken = data?.token;
        if (resetToken) {
          toast.success(data?.detail || "Code verified successfully!");
          router.push("?resetToken=" + encodeURIComponent(resetToken));
          setStep("resetPassword");
        } else {
          toast.error(data?.detail || "OTP verification failed.");
        }
      },
      requestConfig: {
        url: "/accounts/reset-password/verify-otp/",
        method: "POST",
        body: { email, otp: otpString },
      },
    });
  };

  // ✅ Success handler for resend request
  const registerUserRes = (res: any) => {
    toast.success("Verification OTP resent successfully!");
    const backendRetry =
      extractRetryAfter(res?.data) ??
      extractRetryAfter(res) ??
      DEFAULT_RESET_TIMEOUT;
    setTimer(backendRetry);
  };

  // ✅ Handle resend link
  const handleResendLink = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || timer > 0) {
      if (!email) {
        toast.error("Email not found. Please go back and re-enter it.");
        setStep("forgot");
      }
      return;
    }

    resendUserReq({
      successRes: registerUserRes,
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
        successMessage: "Verification OTP resent.",
      },
    });
  };

  // ✅ Return JSX
  return (
    <div className="text-center space-y-4">
      <div className="space-y-2">
        <h2 className="text-c20 font-MontserratSemiBold">Enter OTP</h2>
        <p className="font-MontserratNormal text-sm">
          We've sent a 6-digit code to your email. Enter it below to continue.
          <br />
          <span className="text-base font-MontserratMedium">{email}</span>
        </p>
      </div>

      <div className="flex justify-center mb-8 gap-2 w-full">
        {otp.map((digit, idx) => (
          <Input
            key={idx}
            id={`reset-otp-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            className="sm:max-w-12 max-w-[40.33px] h-c64 text-center text-xl font-MontserratBold px-0"
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          onClick={handleVerifyOtp}
          disabled={otp.some((d) => d === "")}
        >
          Verify
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={loading || timer > 0}
          onClick={handleResendLink}
        >
          {loading ? (
            <LoadingSpinner color="border-ff715b" />
          ) : timer > 0 ? (
            `Resend OTP (${Math.floor(timer / 60)}:${(timer % 60)
              .toString()
              .padStart(2, "0")})`
          ) : (
            "Resend OTP"
          )}
        </Button>
      </div>

      <div>
        <div className="flex justify-center gap-4 text-sm font-MontserratSemiBold text-6a0dad mt-4">
          <button onClick={() => setStep("forgot")}>Change email</button>
        </div>
      </div>
    </div>
  );
}

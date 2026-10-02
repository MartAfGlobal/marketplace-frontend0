"use client";

import { useHttp } from "@/hooks/use-http";
import { MobileLoginProps } from "@/types/global";
import { LoadingSpinner } from "../../loading-spinner";
import { Button } from "../../Button/Button";
import { usePasswordResetCooldown } from "@/hooks/usePasswordResetCooldown";

export default function RecoveryLinkSent({ email = "", setStep, userType = "buyer" }: MobileLoginProps) {
  const { loading, sendHttpRequest } = useHttp();
  const { timer, recordSuccessfulSend } = usePasswordResetCooldown(userType, email);

  const handleResend = () => {
    if (loading || timer > 0) return;
    sendHttpRequest({
      requestConfig: {
        url: userType === "seller" ? "/accounts/manufacturer/forgot-password/" : "/accounts/forgot-password/",
        method: "POST",
        body: { email },
        userType,
        successMessage: "Reset link resent to your email.",
      },
      successRes: () => recordSuccessfulSend(),
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="font-MontserratSemiBold text-c20">Check your inbox</h2>
        <p className="font-MontserratNormal text-sm">
          If there&apos;s an account associated with that email, you&apos;ll receive a reset link shortly.
        </p>
      </div>

      <p className="text-base font-MontserratSemiBold text-161616">{email}</p>

      <Button type="button" onClick={handleResend} disabled={loading || timer > 0}>
        {loading ? (
          <LoadingSpinner />
        ) : timer > 0 ? (
          `Resend email link in (${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")})`
        ) : (
          "Resend email link"
        )}
      </Button>

      <button
        type="button"
        onClick={() => setStep("forgot")}
        className="text-6a0dad font-MontserratSemiBold"
      >
        Change email
      </button>
    </div>
  );
}
"use client";

import { useHttp } from "@/hooks/use-http";
import { MobileLoginProps } from "@/types/global";
import { LoadingSpinner } from "../../loading-spinner";
import { Button } from "../../Button/Button";

export default function RecoveryLinkSent({ email = "", setStep }: MobileLoginProps) {
  const { loading, sendHttpRequest } = useHttp();

  const handleResend = () => {
    sendHttpRequest({
      requestConfig: {
        url: "/accounts/forgot-password/",
        method: "POST",
        body: { email },
        userType: "buyer",
        successMessage: "Reset link resent to your email.",
      },
      successRes: () => undefined,
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

      <Button type="button" onClick={handleResend} disabled={loading}>
        {loading ? <LoadingSpinner /> : "Resend email link"}
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
"use client";

import { useHttp } from "@/hooks/use-http";
import { MobileLoginProps } from "@/types/global";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../../loading-spinner";
import { Button } from "../../Button/Button";
import { Input } from "../../forms/Input";

export default function ForgotPasswordModal({
  onClose,
  setStep,
  email: defaultEmail = "",
  setEmail,
}: MobileLoginProps) {
  const [localEmail, setLocalEmail] = useState(defaultEmail);
  const isFormValid = localEmail.trim() !== "";
  const { loading, sendHttpRequest: UseremailingReq } = useHttp();

  const UserResetLinkRes = (res: any) => {
    toast.success("Reset link sent successfully!");
    if (setEmail) setEmail(localEmail);
    setStep("recoveryLinkSent");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localEmail.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    UseremailingReq({
      successRes: UserResetLinkRes,
      requestConfig: {
        url: "/accounts/forgot-password/",
        method: "POST",
        body: { email: localEmail },
        userType: "buyer",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h2 className="font-MontserratSemiBold  text-c20">Forgot password</h2>
        <p className="font-MontserratNormal text-sm">
          We’ll send a reset link to your email address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          className=""
          placeholder="Email address"
        />

        <Button type="submit" disabled={!isFormValid || loading}>
          {loading ? <LoadingSpinner /> : "Send reset link"}
        </Button>
      </form>

      <p className="text-sm text-center font-MontserratNormal">
        Remember your password?{" "}
        <span
          onClick={() => setStep("signin")}
          className="text-6a0dad font-medium cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </div>
  );
}


"use client";

import { useHttp } from "@/hooks/use-http";
import { MobileLoginProps } from "@/types/global";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js App Router
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../../loading-spinner";
import { Button } from "../../Button/Button";

export default function ForgotPasswordModal({
  onClose,
  setStep,
  email: defaultEmail = "",
  setEmail,
}: MobileLoginProps) {
  const [localEmail, setLocalEmail] = useState(defaultEmail);
  const isFormValid = localEmail.trim() !== "";
  const router = useRouter();
  const { loading, sendHttpRequest: UseremailingReq } = useHttp();

  const UserResetLinkRes = (res: any) => {
    toast.success("Verification link sent successfully!");
    if (setEmail) setEmail(localEmail); // ✅ update parent AuthModal email
    setStep("resetVerify");
  
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
        url: "/accounts/reset-password/",
        method: "POST",
        body: { email: localEmail },
        successMessage: "Verification link sent.",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="font-MontserratSemiBold text-c20">Forgot password</h2>
        <p className="font-MontserratNormal text-sm">
          Enter your email and we’ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={localEmail}
          onChange={(e) => setLocalEmail(e.target.value)}
          className="w-full border border-black/10 rounded-lg px-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
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


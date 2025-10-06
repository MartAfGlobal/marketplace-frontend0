"use client";

import { useHttp } from "@/hooks/use-http";
import { MobileLoginProps } from "@/types/global";
import { toast } from "sonner";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";

export default function ResetVerify({
  onClose,
  setStep,
  email,
}: MobileLoginProps) {
  const { loading, sendHttpRequest: resendUserReq } = useHttp();

  // ✅ Success handler for resend request
  const registerUserRes = (res: any) => {
    toast.success("Verification link resent successfully!");
  };

  // ✅ Handle resend link
  const handleResendLink = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please go back and re-enter it.");
      setStep("forgot");
      return;
    }

    resendUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/resend-verification-email/",
        method: "POST",
        body: { email },
        successMessage: "Verification link resent.",
      },
    });
  };

  // ✅ Return JSX
  return (
    <div className=" text-center">
      <div className="space-y-2 mb-c32">
        <h2 className="text-c20 font-MontserratSemiBold">Check your email</h2>
        <p className="font-MontserratNormal text-sm">
       
          <span className="font-semibold text-6a0dad">{email}</span>
          <br />
          if there’s an account associated with that email, you’ll receive a reset link shortly.
        </p>
      </div>

      <Button
        type="button"
        variant="primary"
        disabled={loading}
        onClick={handleResendLink}
       
      >
        {loading ? <LoadingSpinner /> : "Resend email link"}
      </Button>

      <div>
       
        <div className="flex justify-center gap-4 text-sm font-MontserratSemiBold text-6a0dad mt-4">
          <button onClick={() => setStep("forgot")}>Change email</button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MobileLoginProps } from "@/types/global";



import { validatePassword } from "@/utils/passwordValidation";

export default function ResetPasswordModal({ onClose, setStep, email }: MobileLoginProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("resetToken") || searchParams.get("token") || "";

  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      setStep("forgot");
    }
  }, [token, setStep]);

  const [submitted, setSubmitted] = useState(false);
  const passValidation = validatePassword(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!passValidation.isValid) {
      toast.error(passValidation.errorMessage || "New password does not meet requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    await sendHttpRequest({
      requestConfig: {
        url: "/accounts/reset-password/confirm/",
        method: "POST",
        body: {
          email,
          token,
          password: newPassword,
          confirm_password: confirmPassword,
        },
        userType: "buyer",
      },
      successRes: () => {
        toast.success("Password reset successful!");
        setStep("signin");
      },
    });

    setLoading(false);
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-c20 font-MontserratSemiBold">Reset Password</h2>
      <p className="font-MontserratNormal text-sm">
        Enter a new password for your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <input
            type="password"
            placeholder="New password"
            className="w-full border border-black/10 rounded-lg px-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {(submitted || newPassword.length > 0) && !passValidation.isValid && (
            <p className="text-c12 text-red-500 font-MontserratMedium mt-1">
              {passValidation.errorMessage}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full border border-black/10 rounded-lg px-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ff715b text-white h-c48 rounded-lg text-c12 font-MontserratSemiBold flex items-center justify-center"
        >
          {loading ? <LoadingSpinner /> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

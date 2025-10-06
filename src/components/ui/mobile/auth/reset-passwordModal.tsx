"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MobileLoginProps } from "@/types/global";



export default function ResetPasswordModal({ onClose, setStep }: MobileLoginProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("resetToken");

  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    await sendHttpRequest({
      requestConfig: {
        url: `/accounts/reset-password/confirm/${token}/`,
        method: "POST",
        body: { password: newPassword },
        userType: "buyer",
      },
      successRes: () => {
        toast.success("Password reset successful!");
        setStep("signin") ;
       
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full border border-black/10 rounded-lg px-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full border border-black/10 rounded-lg px-3 h-c48 focus:ring-1 focus:ring-ff715b outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

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

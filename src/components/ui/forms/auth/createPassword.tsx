"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

export default function CreatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { loading, sendHttpRequest: submitReset } = useHttp();

  const isFormValid =
    password.length > 0 && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!email || !otp) {
      toast.error("Missing email or OTP. Please start again.");
      router.push("/auth/forgot-password");
      return;
    }

    submitReset({
      successRes: () => {
        toast.success("Password reset successful! Please log in.");
        router.push("/auth/login");
      },
      requestConfig: {
        url: "/accounts/reset-password/confirm/",
        method: "POST",
        body: { email, otp, password },
        userType: "buyer",
        successMessage: "Password reset successful!",
      },
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-c24">
        <fieldset disabled={loading} className="contents">
          {/* New Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-c12 font-MontserratMedium">New password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-efefef"
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-c12 font-MontserratMedium">Confirm password</Label>
            <Input
              type={showConfirm ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-efefef"
              icon={
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </div>

          {/* Password mismatch hint */}
          {confirmPassword && password !== confirmPassword && (
            <p className="text-c12 text-red-500 font-MontserratMedium -mt-2">
              Passwords do not match
            </p>
          )}
        </fieldset>

        <Button
          type="submit"
          disabled={loading || !isFormValid || password !== confirmPassword}
          className="w-full mt-2"
        >
          {loading ? <LoadingSpinner /> : "Reset password"}
        </Button>
      </form>

      <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-c24">
        {!loading && (
          <Link href="/auth/login" className="text-ff715b">
            Return to login
          </Link>
        )}
      </div>
    </div>
  );
}

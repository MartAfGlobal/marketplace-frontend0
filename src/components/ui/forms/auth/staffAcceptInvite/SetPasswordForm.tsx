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
import { validatePassword } from "@/utils/passwordValidation";

// Step 1 of the staff invite flow — the link from StaffInviteView /
// StaffResendInviteView (departments/rbac_views.py) points straight at
// this route (?token=...&email=...): departments/staff-management/
// accept-invite/set-password/ verifies the one-time temporary password
// emailed to the invitee, sets their real password, and (on success)
// emails a 6-digit OTP for the next step — it does not activate the
// account or log them in yet.
export default function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTemp, setShowTemp] = useState(true);
  const [showNew, setShowNew] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { loading, sendHttpRequest } = useHttp();

  const passValidation = validatePassword(newPassword);
  const isFormValid = !!temporaryPassword && !!newPassword && !!confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email || !token) {
      toast.error("This invite link is missing information. Please use the link from your invite email.");
      return;
    }

    if (!isFormValid) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!passValidation.isValid) {
      toast.error(passValidation.errorMessage || "Password does not meet requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword === temporaryPassword) {
      toast.error("Your new password must be different from the temporary password.");
      return;
    }

    sendHttpRequest({
      requestConfig: {
        url: "/departments/staff-management/accept-invite/set-password/",
        method: "POST",
        body: {
          email,
          token,
          temporary_password: temporaryPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        userType: "admin",
      },
      successRes: (res: any) => {
        const data = res?.data ?? res;
        const params = new URLSearchParams({ email });
        if (data?.retry_after_seconds) params.set("retry_after_seconds", String(data.retry_after_seconds));
        router.push(`/auth/admin/staff/accept-invite/verify-otp?${params.toString()}`);
      },
    });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <p className="font-MontserratBold text-c16 text-161616 break-all">{email}</p>
      </div>

      <div className="text-center mb-8">
        <h2 className="font-MontserratSemiBold text-c18 text-161616 pb-1">Create your new password</h2>
        <p className="text-base font-MontserratNormal text-000000/68">
          Choose a safe, easy to remember and secure password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-c24">
        <fieldset disabled={loading} className="contents">
          <div className="flex flex-col gap-2">
            <Label className="text-c12 font-MontserratMedium">Temporary Password</Label>
            <Input
              type={showTemp ? "text" : "password"}
              value={temporaryPassword}
              onChange={(e) => setTemporaryPassword(e.target.value)}
              className="border border-efefef"
              icon={
                <button type="button" onClick={() => setShowTemp((p) => !p)} aria-label={showTemp ? "Hide password" : "Show password"}>
                  {showTemp ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-c12 font-MontserratMedium">New Password</Label>
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-efefef"
              icon={
                <button type="button" onClick={() => setShowNew((p) => !p)} aria-label={showNew ? "Hide password" : "Show password"}>
                  {showNew ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                </button>
              }
            />
            {(submitted || newPassword.length > 0) && !passValidation.isValid && (
              <p className="text-c12 text-red-500 font-MontserratMedium mt-1">{passValidation.errorMessage}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-c12 font-MontserratMedium">Confirm password</Label>
            <Input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-efefef"
              icon={
                <button type="button" onClick={() => setShowConfirm((p) => !p)} aria-label={showConfirm ? "Hide password" : "Show password"}>
                  {showConfirm ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                </button>
              }
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-c12 text-red-500 font-MontserratMedium">Passwords do not match</p>
            )}
          </div>
        </fieldset>

        <Button type="submit" disabled={loading || !isFormValid} className="w-full mt-2">
          {loading ? <LoadingSpinner /> : "Continue"}
        </Button>
      </form>
    </div>
  );
}

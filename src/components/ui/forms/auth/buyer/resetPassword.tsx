"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useHttp } from "@/hooks/use-http";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { ResetParams } from "@/types/global";
import { toast } from "sonner";
import { tokenActions } from "@/store/token/token-slice";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useParams();

  const [formData, setFormData] = useState<ResetParams>({
    newPassword: "",
    comfirmPassword: "",
  });

  const { loading, sendHttpRequest: resetRequest } = useHttp();

  // ✅ Detect mobile and redirect immediately
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|android|mobile|ipod|blackberry|iemobile|opera mini/.test(userAgent);

    setIsMobile(isMobileDevice);

    if (isMobileDevice && token) {
      // Redirect to home, where AuthModal auto-opens with reset form
      router.replace(`/?authStep=resetPassword&resetToken=${token}`);
    }
  }, [router, token]);

  // ✅ If it's mobile, don’t render the form
  if (isMobile) return null;

  const toggleVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmVisibility = () => setShowConfirmPass((prev) => !prev);

  const handleSuccess = (res: any) => {
    const accessToken = res?.data?.access;

    toast.success("Password reset successful!");
    if (accessToken) {
      dispatch(tokenActions.setToken(accessToken));
    }

    router.push("/auth/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { newPassword, comfirmPassword } = formData;

    if (!newPassword || !comfirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (newPassword !== comfirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    resetRequest({
      requestConfig: {
        url: `/accounts/reset-password/confirm/${token}/`,
        method: "POST",
        body: { password: newPassword },
        userType: "buyer",
        successMessage: "Password reset successful!",
      },
      successRes: handleSuccess,
    });
  };

  const isFormValid = formData.newPassword && formData.comfirmPassword;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="flex flex-col gap-2">
          <Label className="text-c12 font-MontserratMedium">New password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            id="newPassword"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            icon={
              <button type="button" onClick={toggleVisibility}>
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            }
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <Label className="text-c12 font-MontserratMedium">Confirm password</Label>
          <Input
            type={showConfirmPass ? "text" : "password"}
            id="comfirmPassword"
            value={formData.comfirmPassword}
            onChange={(e) => setFormData({ ...formData, comfirmPassword: e.target.value })}
            icon={
              <button type="button" onClick={toggleConfirmVisibility}>
                {showConfirmPass ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            }
          />
        </div>

        <Button type="submit" disabled={loading || !isFormValid} className="w-full h-c48 mt-6">
          {loading ? <LoadingSpinner /> : "Reset password"}
        </Button>
      </form>
    </div>
  );
}

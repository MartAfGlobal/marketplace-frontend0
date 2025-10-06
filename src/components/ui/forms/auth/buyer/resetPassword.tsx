"use client";

import { useRouter, useParams } from "next/navigation"; // 👈 added useParams
import { useState } from "react";
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
  const [showComfirmPass, setShowComfirmPass] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useParams(); // 👈 get token from route

  const [formData, setFormData] = useState<ResetParams>({
    newPassword: "",
    comfirmPassword: "",
  });

  const { loading, sendHttpRequest: resetRequest } = useHttp();

  const toggleVisibility = () => setShowPassword((prev) => !prev);
  const toggleComfirmPassVisibility = () => setShowComfirmPass((prev) => !prev);

  const handleSuccess = (res: any) => {
    const accessToken = res?.data?.access;
    if (!accessToken) {
      toast.success("Password reset successful!");
      router.push("/auth/login");
      return;
    }
    dispatch(tokenActions.setToken(accessToken));
    toast.success("Password reset successful!");
    router.push("/auth/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.comfirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (formData.newPassword !== formData.comfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // ✅ Use actual token from URL
    resetRequest({
      requestConfig: {
        url: `/accounts/reset-password/confirm/${token}/`, // 👈 dynamic token
        method: "POST",
        body: { new_password: formData.newPassword },
        userType: "buyer",
        successMessage: "Password reset successful!",
      },
      successRes: handleSuccess,
    });
  };

  const isFormValid = formData.newPassword && formData.comfirmPassword;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} className="w-full">
          {/* New Password */}
          <div className="flex flex-col gap-2 pt-4">
            <Label className="text-c12 font-MontserratMedium">New password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              icon={
                <button type="button" onClick={toggleVisibility}>
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              }
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2 pt-4 mb-c32">
            <Label className="text-c12 font-MontserratMedium">
              Confirm password
            </Label>
            <Input
              type={showComfirmPass ? "text" : "password"}
              icon={
                <button type="button" onClick={toggleComfirmPassVisibility}>
                  {showComfirmPass ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              }
              id="comfirmPassword"
              value={formData.comfirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, comfirmPassword: e.target.value })
              }
            />
          </div>
        </fieldset>

        <Button type="submit" disabled={loading || !isFormValid}>
          {loading ? <LoadingSpinner /> : "Reset password"}
        </Button>
      </form>
    </div>
  );
}

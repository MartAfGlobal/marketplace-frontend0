"use client";

import { useRouter } from "next/navigation";
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
  const [showComfirmPass, setShowComfirmPass] = useState(false)
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<ResetParams>({
    newPassword: "",
    comfirmPassword: "",
  });

  const { loading, sendHttpRequest: loginRequest } = useHttp();



  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleComfirmPassVisibility = () =>{
    setShowComfirmPass((prev)=> !prev)
  }

  const loginSuccess = (res: any) => {
    const accessToken = res?.data?.access;

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

 

    dispatch(tokenActions.setToken(accessToken));
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

    loginRequest({
      requestConfig: {
        url: "/accounts/reset-password/confirm/<str:token>/",
        method: "POST",
        body: {
          email: formData.newPassword,
          password: formData.comfirmPassword,
        },
        userType: "buyer",
        successMessage: "Password reset successful!",
      },
      successRes: loginSuccess,
    });
  };

  const isFormValid = formData.newPassword !== "" && formData.comfirmPassword !== "";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <fieldset disabled={loading} className="w-full">
        <div className="flex flex-col gap-2 pt-4">
            <Label className="text-c12 font-MontserratMedium">
              New password
            </Label>
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

          {/* Password */}
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
        {/* Submit */}
        <Button type="submit" disabled={loading || !isFormValid}>
          {loading ? <LoadingSpinner /> : "Reset password"}
        </Button>
      </form>
    </div>
  );
}

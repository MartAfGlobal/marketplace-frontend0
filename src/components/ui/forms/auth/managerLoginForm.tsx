"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { useState } from "react";
import Image from "next/image";
import Email from "@/assets/FormIcon/email.svg";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface ManagerLoginFormProps {
  onSuccess?: (token: string) => void;
}

export default function ManagerLoginForm({ onSuccess }: ManagerLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, sendHttpRequest: loginRequest } = useHttp();

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const loginSuccess = (res: any) => {
    const accessToken = res?.data?.access;

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

    localStorage.setItem("accessToken", accessToken);

    if (onSuccess) {
      onSuccess(accessToken);
    } else {
      router.push("/dashboard/admin/overview");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    loginRequest({
      requestConfig: {
        url: "/accounts/admin/login/",
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
      },
      successRes: loginSuccess,
    });
  };

  const isFormValid = formData.email !== "" && formData.password !== "";

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <fieldset disabled={loading} className="w-full">
          <div className="flex flex-col gap-2">
            <Label className="text-c12 font-MontserratMedium">Email</Label>
            <Input
              icon={<Image src={Email} alt="email" width={20} height={20} />}
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border border-efefef"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 pt-4">
            <Label className="text-c12 font-MontserratMedium">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              icon={
                <button type="button" onClick={toggleVisibility}>
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5" />
                  )}
                </button>
              }
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-ff715b hover:bg-ff715b/90 text-white rounded-c4 py-3 font-MontserratMedium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

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
import Link from "next/link";

interface UnifiedLoginFormProps {
  userType: "admin" | "seller" | "buyer";
  title?: string;
  description?: string;
  hideHeader?: boolean;
}

export default function UnifiedLoginForm({ 
  userType, 
  title = "Sign In", 
  description = "Sign in to start working in our services",
  hideHeader = false
}: UnifiedLoginFormProps) {
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

    if (userType === "admin") {
      router.push("/dashboard/admin/overview");
    } else if (userType === "seller") {
      router.push("/dashboard/seller/overview");
    } else {
      router.push("/");
    }
    
    toast.success("Login successful!");
  };

  const getApiUrl = () => {
    switch (userType) {
      case "admin": return "/accounts/admin/login/";
      case "seller": return "/accounts/manufacturer/login/";
      case "buyer": return "/accounts/login";
      default: return "/accounts/login";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    loginRequest({
      requestConfig: {
        url: getApiUrl(),
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
    <div className={`w-full max-w-md mx-auto ${!hideHeader ? 'bg-white p-8 rounded-3xl shadow-sm border border-efefef' : ''}`}>
      {!hideHeader && (
        <div className="text-center mb-8">
          <h1 className="text-2xl font-MontserratBold text-161616 mb-2">
            {title}
          </h1>
          <p className="text-sm text-666666 font-MontserratMedium">
            {description}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="border border-efefef h-12"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <div className="flex justify-between items-center">
              <Label className="text-c12 font-MontserratMedium">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs text-ff715b hover:underline">
                Forgot?
              </Link>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              icon={
                <button type="button" onClick={toggleVisibility}>
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeOffIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              }
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border border-efefef h-12"
            />
          </div>

          <div className="pt-8">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-6a0dad hover:bg-[#5a0dad] text-white rounded-xl py-4 font-MontserratBold shadow-lg shadow-6a0dad/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          {userType !== "admin" && (
            <div className="mt-8 pt-8 border-t border-efefef text-center">
              <p className="text-xs text-666666 font-MontserratMedium">
                Don&apos;t have an account?{" "}
                <Link 
                  href={userType === "seller" ? "/auth/seller/sign-up" : "/auth/register"} 
                  className="text-6a0dad font-MontserratBold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
}

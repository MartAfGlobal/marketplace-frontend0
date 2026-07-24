"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { useState, useEffect } from "react";
import Image from "next/image";
import Google from "@/assets/socialIcons/Google.svg";
import Email from "@/assets/FormIcon/email.svg";
import { LoginParams } from "@/types/global";
import { toast } from "sonner";
import { tokenActions } from "@/store/token/token-slice";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDispatch } from "react-redux";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RegProps } from "./verify-email";

export default function LoginForm({ userType }: RegProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Get the previous page if passed
  const fromPage = searchParams.get("from");

  const [formData, setFormData] = useState<LoginParams>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { loading, sendHttpRequest: loginRequest } = useHttp();

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, []);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginSuccess = (accessToken: string) => {
    // Save email & password if "Remember me" is checked
    if (formData.rememberMe) {
      localStorage.setItem("rememberEmail", formData.email);
      localStorage.setItem("rememberPassword", formData.password);
    } else {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    }

    localStorage.setItem("accessToken", accessToken);

    dispatch(tokenActions.setToken(accessToken));

    // ⭐ Admin redirect
    if (userType === "admin") {
      if (fromPage && fromPage !== "/auth/admin/login") {
        router.push(fromPage);
        return;
      }
      router.push("/dashboard/admin");
      return;
    }

    // ⭐ If user comes from sign-up → go to home
    if (fromPage === "/auth/register") {
      router.push("/");
      return;
    }

    // ⭐ If a previous page exists and isn't a login page
    if (fromPage && fromPage !== "/auth/login" && fromPage !== "/auth/seller/login" && fromPage !== "/auth/admin/login") {
      router.push(fromPage);
      return;
    }

    if (userType === "seller") {
      if (fromPage && fromPage !== "/auth/seller/login") {
        router.push(fromPage);
        return;
      }
      const redirectUrl = localStorage.getItem("sellerRedirectUrl");
      if (redirectUrl) {
        localStorage.removeItem("sellerRedirectUrl");
        router.push(redirectUrl);
      } else {
        router.push("/dashboard/seller/overview");
      }
      return;
    }

    // ⭐ Default fallback for buyers — always go to homepage
    router.push("/");
  };

  const loginSuccess = (res: any) => {
    const accessToken = res?.data?.access;
    const refreshToken =
      res?.data?.refresh || res?.data?.refresh_token || res?.data?.refreshToken;

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    handleLoginSuccess(accessToken);
  };

  const url =
    userType === "seller"
      ? "/accounts/login"
      : userType === "admin"
      ? "/accounts/admin/login/"
      : "/accounts/login";

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
        url: url,
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
          check: formData.rememberMe,
        },
        userType: userType,
        successMessage: "Login successful!",
      },
      successRes: loginSuccess,
      errorRes: (err: any) => {
        const data = err?.response?.data;
        if (data?.requires_2fa) {
          const params = new URLSearchParams();
          params.set("user_id", data.user_id);
          params.set("email", formData.email);
          params.set("userType", userType);
          if (data.retry_after_seconds !== undefined) {
            params.set("retry_after", String(data.retry_after_seconds));
          }
          if (formData.rememberMe) {
            params.set("remember", "true");
          }
          router.push(`/auth/verify-2fa?${params.toString()}`);
        }
      }
    });
  };

  const isFormValid = formData.email !== "" && formData.password !== "";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <fieldset disabled={loading} className="w-full">
          <div className="flex flex-col gap-2 pt-4">
            <Label className="text-c12 font-MontserratMedium">Email</Label>
            <Input
              icon={<Image src={Email} alt="email" width={20} height={20} />}
              id="email"
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Remember Me */}
          <div className="flex justify-between pt-6 mb-c32 items-center">
            <div className="flex items-center gap-2">
              <label className="relative flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="peer h-5 w-5 rounded-c4 border cursor-pointer border-ff715b appearance-none checked:bg-ff715b checked:border-ff715b"
                />
                <span className="absolute left-0 top-0 h-5 w-5 flex items-center justify-center text-white font-bold scale-0 peer-checked:scale-100 transition-transform">
                  ✓
                </span>
                <span className="text-c12 font-MontserratMedium text-161616">
                  Remember me
                </span>
              </label>
            </div>

            <Link
              href="/auth/forgot-password"
              className="text-ff715b text-c12 font-MontserratMedium"
            >
              Forgot password?
            </Link>
          </div>
        </fieldset>

        {/* Submit */}
        <Button type="submit" disabled={loading || !isFormValid}>
          {loading ? <LoadingSpinner /> : "Sign in"}
        </Button>
      </form>

      {/* Google sign-in & sign-up — hidden for admin */}
      {userType !== "admin" && (
        <>
          <div className="flex justify-between items-center gap-c24 mt-c8 mb-c8 h-c24">
            <p className="h-c1 w-full bg-efefef"></p>
            <p className="text-base font-MontserratNormal">or</p>
            <p className="h-c1 w-full bg-efefef"></p>
          </div>

          <div>
            <button className="w-full border flex items-center justify-center h-c48 font-MontserratSemiBold text-base gap-2 border-161616 rounded-c8">
              <Image
                src={Google}
                width={24}
                height={24}
                alt="google sign in"
                className="md:h-c24 md:w-24 h-c32 w-c32"
              />
              Sign in with Google
            </button>
          </div>

          <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-4">
            <p className="text-161616"> have an account?</p>

            {userType === "seller" ? (
              <Link href="/auth/seller/sign-up" className="text-ff715b">
                Sign up
              </Link>
            ) : (
              <Link href="/auth/register" className="text-ff715b">
                Sign up
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

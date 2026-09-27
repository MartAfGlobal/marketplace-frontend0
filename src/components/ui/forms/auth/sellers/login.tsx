"use client";

import { Input } from "../../Input";

import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useEffect, useState } from "react";
import Image from "next/image";

import eye from "@/assets/FormIcon/eyeIcon.svg";
import Email from "@/assets/FormIcon/email.svg";
import { LoginParams } from "@/types/global";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { tokenActions } from "@/store/token/token-slice";
import { useDispatch } from "react-redux";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SellerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const rememberKey = "rememberLogin_seller";

  const [formData, setFormData] = useState<LoginParams>({
    email: "",
    password: "",
    rememberMe: rememberMe,
  });

  const router = useRouter();

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const dispatch = useDispatch();

  // ✅ Prefill form on mount if stored for the seller flow only
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(rememberKey);
    if (!stored) {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.email && parsed?.password) {
        setFormData({
          email: parsed.email,
          password: parsed.password,
          rememberMe: true,
        });
        setRememberMe(true);
      }
    } catch {
      localStorage.removeItem(rememberKey);
    }
  }, [rememberKey]);

  const { loading, sendHttpRequest: loginRequest } = useHttp();

  const handleTwoFactorRedirect = (data: any) => {
    const userId = data?.user_id || data?.userId || data?.id || data?.user?.id;
    const params = new URLSearchParams();
    if (userId) {
      params.set("user_id", String(userId));
    }
    params.set("email", formData.email);
    params.set("userType", "seller");
    const retryAfter =
      data?.retry_after ??
      data?.retry_after_seconds ??
      data?.resend_after ??
      data?.cooldown ??
      data?.wait_seconds;
    if (retryAfter !== undefined && retryAfter !== null) {
      params.set("retry_after", String(retryAfter));
    }
    if (formData.rememberMe) {
      params.set("remember", "true");
    }
    const message =
      data?.message ||
      data?.detail ||
      "A 2FA verification code has been sent to your email.";
    toast.info(message);
    router.push(`/auth/verify-2fa?${params.toString()}`);
  };

  const is2FaRequired = (data: any) => {
    return Boolean(
      data?.requires_2fa ||
      data?.requires_two_factor ||
      data?.two_factor_required ||
      data?.is_2fa ||
      data?.is_two_factor ||
      data?.two_factor ||
      (!data?.access && !data?.token && (data?.user_id || data?.userId))
    );
  };

  const loginSuccess = (res: any) => {
    const data = res?.data?.data ?? res?.data;

    if (is2FaRequired(data)) {
      handleTwoFactorRedirect(data);
      return;
    }

    const accessToken = data?.access || data?.token || data?.accessToken;
    const refreshToken =
      data?.refresh || data?.refresh_token || data?.refreshToken;

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    dispatch(tokenActions.setToken(accessToken));
    toast.success("Login successful!");

    const redirectUrl = localStorage.getItem("sellerRedirectUrl");
    if (redirectUrl) {
      localStorage.removeItem("sellerRedirectUrl");
      router.push(redirectUrl);
    } else {
      router.push("/dashboard/seller/overview");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem(
          rememberKey,
          JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        );
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      } else {
        localStorage.removeItem(rememberKey);
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }
    }
    // Validation
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
        url: "/accounts/login",
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
          check: formData.rememberMe
        },
        userType: "seller",
      },
      successRes: loginSuccess,
      errorRes: (err: any) => {
        const data = err?.response?.data?.data ?? err?.response?.data;
        if (is2FaRequired(data)) {
          handleTwoFactorRedirect(data);
        }
      },
    });
  };

  const isFormValid = formData.email !== "" && formData.password !== "";

  return (
    <div className=" w-full max-w-130 min-w-90 px-14  flex items-center  justify-center py-c48 rounded-c16 signUp ">
      <div className="h-full w-full">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-MontserratSemiBold text-c32 m-0">Sign in </h2>
          <p className="font-MontserratNormal text-sm m-0">
            Sign in to start enjoying our services.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <fieldset disabled={loading}>
            <div className="flex flex-col gap-2 mb-3">
              <label className="text-c12 font-MontserratMedium text-000000 ">
                email
              </label>
              <Input
                id="email"
                type="email"
                icon={<Image src={Email} alt="email" width={20} height={20} />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-efefef "
              />
            </div>

            <div className="flex flex-col gap-2  ">
              <label className="text-c12 font-MontserratMedium ">
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                icon={
                  <button type="button" onClick={toggleVisibility}>
                     {showPassword ?<EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" /> }
                  </button>
                }
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className=" "
              />
            </div>

            <div className="flex items-center gap-3 pt-6 pb-c32">
              <input
                type="checkbox"
                className={`appearance-none h-5 w-5 rounded-c4 cursor-pointer border-1 border-ff715b checked:bg-ff715b checked:border-0 checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:font-bold checked:after:text-center checked:after:leading-5`}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <p className="text-c12 font-MontserratMedium">Remember me</p>
            </div>
          </fieldset>
          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? <LoadingSpinner /> : "Sign in"}
          </Button>
        </form>
        
        <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-6">
          <p className="text-161616"> have an account?</p>
          <Link href="/auth/seller/sign-up"  className={`text-ff715b ${loading ? "pointer-events-none opacity-50" : ""}`}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
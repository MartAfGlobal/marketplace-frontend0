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

export default function SellerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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


    // ✅ Prefill form on mount if stored
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
      setRememberMe(true);
    }
  }, []);

  const { loading, sendHttpRequest: loginRequest } = useHttp();

  const loginSuccess = (res: any) => {
    // backend sends { access: "..." }
    const accessToken = res?.data?.access;
   
    console.log("Access token:", accessToken);

    if (!accessToken) {
      toast.error("Login failed: No token received.");
      return;
    }

    dispatch(tokenActions.setToken(accessToken));

    router.push("/dashboard/seller");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem("rememberEmail", formData.email);
      localStorage.setItem("rememberPassword", formData.password);
    } else {
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
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
    },
    userType: "seller", 
    successMessage: "Login successful!",
  },
  successRes: loginSuccess,
})
  };

  const isFormValid = formData.email !== "" && formData.password !== "";

  return (
    <div className=" w-full max-w-130 min-w-90 px-14  flex items-center  justify-center py-6 rounded-c16 signUp ">
      <div className="h-full w-full">
        <div className="text-center space-y-2 mb-4">
          <h2 className="font-MontserratSemiBold text-c32 m-0">Sign in </h2>
          <p className="font-MontserratNormal text-sm m-0">
            Sign in to start enjoying our services.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-2">
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
            <label className="text-c12 font-MontserratMedium ">Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              icon={
                <button type="button" onClick={toggleVisibility}>
                  <Image src={eye} alt="email" width={20} height={20} />
                </button>
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className=" "
            />
          </div>

          <div className="flex items-center gap-3 pt-3.5 pb-c32">
            <input
              type="checkbox"
              className={`appearance-none h-5 w-5 rounded-c4 cursor-pointer border-1 border-ff715b checked:bg-ff715b checked:border-0 checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:font-bold checked:after:text-center checked:after:leading-5`}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <p className="text-c12 font-MontserratMedium">Remember me</p>
          </div>

          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? <LoadingSpinner /> : "Sign in"}
          </Button>
        </form>

        <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-6">
          <p className="text-161616"> have an account?</p>
          <Link href="/auth/seller/sign-up" className="text-ff715b">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

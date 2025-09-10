"use client";

import { Input } from "../../Input";

import Phone from "@/assets/icons/callIcon.png";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useState } from "react";
import Image from "next/image";

import eye from "@/assets/FormIcon/eyeIcon.svg";
import Email from "@/assets/FormIcon/email.svg";
import { RegisterParams } from "@/types/global";
import { toast } from "sonner";
import { useHttp } from "@/hooks/use-http";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SellerSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  const [formData, setFormData] = useState<RegisterParams>({
    email: "",
    password: "",
    confirm_password: "",
    is_manufacturer: true,
    phone: "",
  });

  const router = useRouter();

  const { loading, sendHttpRequest: registerUserReq } = useHttp();

  const registerUserRes = (res: any) => {
    router.push(
      `/auth/seller/verify-email?email=${encodeURIComponent(formData.email)}`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/register/manufacturer/",
        method: "POST",
        body: {
          ...formData,
        },
        successMessage: "data submited, Please verify.",
      },
    });

    console.log("Registration data:", { ...formData });
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormValid =
    formData.email !== "" &&
    formData.password !== "" &&
    formData.phone !== "" &&
    formData.confirm_password !== "" &&
    checkbox === true;

  return (
    <div className=" w-full max-w-130 px-c56 min-w-90  flex items-center  justify-center py-6 rounded-c16 signUp ">
      <div className="h-full w-full  ">
        <div className="text-center space-y-2 mb-4">
          <h2 className="font-MontserratSemiBold text-c32 m-0">Sign up</h2>
          <p className="font-MontserratNormal text-base m-0">
            Welcome! Let’s set up your seller account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className=" w-full ">
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
          <div className="flex flex-col gap-2">
            <label className="text-c12 font-MontserratMedium text-000000 ">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              icon={<Image src={Phone} alt="email" width={20} height={20} />}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
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
          <div className="flex flex-col gap-2">
            <label className="text-c12 font-MontserratMedium ">
              Confirm password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              icon={
                <button type="button" onClick={toggleVisibility}>
                  <Image src={eye} alt="email" width={20} height={20} />
                </button>
              }
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
              className=""
            />
          </div>

          <div className="flex items-center gap-3 pt-3.5 pb-c32">
            <input
              type="checkbox"
              className="h-5 w-5 rounded-c4 "
              onChange={(e) => setCheckbox(e.target.checked)}
            />
            <p className="text-c12 font-MontserratMedium">
              I agree to the{" "}
              <span className="text-6a0dad">Terms of Service </span> and{" "}
              <span className="text-6a0dad">Privacy Policy</span>.
            </p>
          </div>

          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? <LoadingSpinner /> : "Continue"}
          </Button>
        </form>

        <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-6">
          <p className="text-161616"> have an account?</p>
          <Link href="/auth/seller/login" className="text-ff715b">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

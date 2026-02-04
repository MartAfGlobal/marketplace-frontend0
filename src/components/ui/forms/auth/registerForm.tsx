"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Google from "@/assets/socialIcons/Google.svg";
import eye from "@/assets/FormIcon/eyeIcon.svg";
import Email from "@/assets/FormIcon/email.svg";
import PhoNEiCON from "@/assets/FormIcon/phoneIcon.svg";
import { toast } from "sonner";
import { UserType } from "@/resources/enum";
import { RegisterParams } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { RegProps } from "./verify-email";
import { useSelector } from "react-redux";

export default function RegisterForm({ userType, token }: RegProps) {

  const VerifiedEmail = useSelector((state: any) => state.registration.email);
  const [formData, setFormData] =
    userType === "buyer"
      ? useState<RegisterParams>({
          email: "",
          password: "",
          confirm_password: "",
        })
      : useState<RegisterParams>({
          password: "",
          confirm_password: "",
          phone: "",
        });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const router = useRouter();

  const { loading, error, sendHttpRequest: registerUserReq } = useHttp();

  const registerUserRes = (res: any) => {

    if (userType === "seller") {
      router.push(`/auth/seller/sign-up/registration-step2`);
      return;
    } 
    else {
    router.push(`/auth/login`);
  }
  };

    // useEffect(() => {
    //   if (!error) return;
    //   console.log("Error message:", error);
  
    //   if (error.includes("No EmailVerificationToken matches the given query")) {
    //     router.push(
    //       `/auth/seller/sign-up/email-verification-sent?email=${encodeURIComponent(VerifiedEmail)}`,
    //     );
    
    //   }
    // }, [error, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match!");
      return;
    }

    if (userType === "buyer" && !formData.email?.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    if (userType === "seller" && !formData.phone) {
      toast.error("Please enter your phone number!");
      return;
    }

    const Url =
      userType === UserType.BUYER
        ? "/accounts/register"
        : `/accounts/manufacturer/set-password-phone/${token}/`;

    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: Url,
        method: "POST",
        body: {
          ...formData,
        },
        userType: "buyer",
        successMessage: "Registration Complete, Please login.",
      },
    });

    console.log("Registration data:", { ...formData });
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormValid =
    userType === "buyer"
      ? formData.email !== "" &&
        formData.password !== "" &&
        formData.confirm_password !== ""
      : formData.phone !== "" &&
        formData.confirm_password !== "" &&
        formData.password !== "";

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //   };

  return (
    <>
      <div className=" w-full h-full">
        <div className="h-full w-ful">
          <form className="" onSubmit={handleSubmit}>
            <fieldset disabled={loading}>
              {userType === "buyer" ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Label className="text-c12 font-MontserratMedium ">
                    email
                  </Label>
                  <Input
                    icon={
                      <Image src={Email} alt="email" width={20} height={20} />
                    }
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border border-efefef "
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Label className="text-c12 font-MontserratMedium ">
                    Mobile number
                  </Label>
                  <Input
                    icon={
                      <Image
                        src={PhoNEiCON}
                        alt="phone"
                        width={11.25}
                        height={17.5}
                      />
                    }
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="border border-efefef "
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 pt-3 ">
                <Label className="text-c12 font-MontserratMedium ">
                  Password
                </Label>
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
                  className=" "
                />
              </div>
              <div className="flex flex-col gap-2 pt-3 mb-c20">
                <Label className="text-c12 font-MontserratMedium ">
                  Confirm password
                </Label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  icon={
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeOffIcon className="w-5 h-5" />
                      )}
                    </button>
                  }
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  className=""
                />
              </div>
            </fieldset>
            {userType === "buyer" ? (
              <Button type="submit" disabled={loading || !isFormValid}>
                {loading ? <LoadingSpinner /> : "Create Account"}
              </Button>
            ) : (
               <Button type="submit" disabled={loading || !isFormValid}>
                {loading ? <LoadingSpinner /> : "Next"}
              </Button>
            )}
          </form>
          {userType === "buyer" && (
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
                    width={20}
                    height={20}
                    alt="google sign in"
                    className="h-c20 w-20"
                  />
                  Sign in with Google
                </button>
              </div>
              <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-4">
                <p className="text-161616"> have an account?</p>
                <Link href="/auth/login" className="text-ff715b">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

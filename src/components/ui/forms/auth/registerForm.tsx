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
import { useDispatch, useSelector } from "react-redux";
import { tokenActions } from "@/store/token/token-slice";


export interface RegProps {
  userType: "seller" | "buyer" | "admin";
  token?: string;
  businessType?: "registered" | "individual";
  onSuccess?: () => void;
}

export default function RegisterForm({ userType, token, onSuccess }: RegProps) {
  const dispatch = useDispatch()

  const VerifiedEmail = useSelector((state: any) => state.registration.email);
  const [formData, setFormData] = useState<RegisterParams>({
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
    const accessToken = res?.data?.access;
    console.log("reg token", res);

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      dispatch(tokenActions.setToken(accessToken));
    }

    if (userType === "seller") {
      router.push(`/auth/seller/sign-up/registration-step2`);
      return;
    }

    // On mobile, call onSuccess to close the modal gracefully
    if (onSuccess) {
      onSuccess();
    } else {
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

    if (!formData.phone) {
      toast.error("Please enter your phone number!");
      return;
    }
    console.log("fcfc", token)

 
     

    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/register/complete/",
        method: "POST",
        body: {
          ...formData,
          token,
          email: VerifiedEmail
        },
        userType: userType,
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
    formData.phone !== "" &&
    formData.password !== "" &&
    formData.confirm_password !== "";

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
              <div className="flex flex-col gap-2 pt-2">
                <Label className=" ">
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
              <div className="flex flex-col gap-2 pt-3 ">
                <Label className=" ">
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
                <Label className=" ">
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
                    alt="google sign up"
                    className="h-c20 w-c20"
                  />
                  Sign up with Google
                </button>
              </div>
              <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-4">
                <p className="text-161616">Already have an account?</p>
                <Link href="/auth/login" className="text-ff715b">
                  Sign in
                </Link>
              </div>
            </>
        </div>
      </div>
    </>
  );
}

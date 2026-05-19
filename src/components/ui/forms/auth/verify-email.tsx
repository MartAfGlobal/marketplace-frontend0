"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Google from "@/assets/socialIcons/Google.svg";
import eye from "@/assets/FormIcon/eyeIcon.svg";
import Email from "@/assets/FormIcon/email.svg";
import { toast } from "sonner";
import { UserType } from "@/resources/enum";
import { RegisterParams, VerifyParams } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { registrationActions } from "@/store/auth/registration-slice";
import { useDispatch } from "react-redux";
import ResultModal from "@/components/ui/forms/resultModal";

export interface RegProps {
  userType: "seller" | "buyer" | "admin";
  token?: string;
  businessType?: "registered" | "individual";
}

export default function VerifyEmail({ userType, token }: RegProps) {
  const [formData, setFormData] = useState<VerifyParams>({
    email: "",
  });

  const dispatch = useDispatch();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { loading, error, sendHttpRequest: registerUserReq } = useHttp();

  const email = formData.email;

  const registerUserRes = (res: any) => {
    dispatch(registrationActions.setEmail(email));
    setShowSuccessModal(true);
  };

  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    router.push(
      `/auth/${userType === "buyer" ? "buyer" : "seller"}/sign-up/email-verification-sent?email=${encodeURIComponent(email)}`,
    );
  };

  useEffect(() => {
    if (!error) return;
    console.log("Error message:", error);

    const lowerError = error.toLowerCase();
    if (
      lowerError.includes("already been sent") ||
      lowerError.includes("already sent")
    ) {
      router.push(
        `/auth/${userType === "buyer" ? "buyer" : "seller"}/sign-up/email-verification-sent?email=${encodeURIComponent(email)}`,
      );
      dispatch(registrationActions.setEmail(email));
    }
  }, [error, email, router, userType, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    registerUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: userType === "buyer" ? "/accounts/register" : "/accounts/register/manufacturer/",
        method: "POST",
        body: {
          ...formData,
        },
        userType: userType,
      },
    });

    console.log("Registration data:", { ...formData });
  };

  // const [showPassword, setShowPassword] = useState(false);

  // const toggleVisibility = () => {
  //   setShowPassword((prev) => !prev);
  // };

  const isFormValid = formData.email !== "";

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //   };

  return (
    <div className=" w-full h-full">
      <div className="h-full w-ful">
        <form className="" onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <div className="flex flex-col gap-2 pt-2 mb-c32">
              <Label className="text-c12 font-MontserratMedium ">email</Label>
              <Input
                icon={<Image src={Email} alt="email" width={20} height={20} />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-efefef "
              />
            </div>
          </fieldset>
          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? <LoadingSpinner /> : "Verify email"}
          </Button>
        </form>
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
          <Link href={userType === "buyer" ? "/auth/login" : "/auth/seller/login"} className="text-ff715b">
            Sign in
          </Link>
        </div>
      </div>
      <ResultModal
        isOpen={showSuccessModal}
        title="Verification email sent"
        message="A verification link has been sent to your email address."
        buttenText="Okay"
        onConfirm={handleModalConfirm}
        onCancel={handleModalConfirm}
      />
    </div>
  );
}

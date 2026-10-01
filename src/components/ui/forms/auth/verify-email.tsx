"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const [showExistingEmailModal, setShowExistingEmailModal] = useState(false);

  const dispatch = useDispatch();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const router = useRouter();

  const { loading, sendHttpRequest: registerUserReq } = useHttp();
  const email = formData.email;

  const registerUserRes = (res: any) => {
    toast.success("OTP sent to your Email")
    
    dispatch(registrationActions.setEmail(email));
    router.push(
      `/auth/${userType === "buyer" ? "buyer" : "seller"}/sign-up/email-verification-sent?email=${encodeURIComponent(email)}`,
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    registerUserReq({
      successRes: registerUserRes,
      errorRes: (err: any) => {
        const data = err?.response?.data;
        const errorMessage = typeof data === "string" ? data : JSON.stringify(data ?? "");
        const lowerError = errorMessage.toLowerCase();

        if (
          lowerError.includes("already been sent") ||
          lowerError.includes("already sent")
        ) {
          router.push(
            `/auth/${userType === "buyer" ? "buyer" : "seller"}/sign-up/email-verification-sent?email=${encodeURIComponent(email)}`,
          );
          dispatch(registrationActions.setEmail(email));
          return;
        }

        const duplicateEmail =
          err?.response?.status === 409 ||
          ((/email|account|user|profile/.test(lowerError)) &&
            /(already|exist|registered|taken|in use|linked|associated)/.test(lowerError));

        if (duplicateEmail && userType !== "admin") {
          setShowExistingEmailModal(true);
          return;
        }

        toast.error(
          data?.detail || data?.message || "Unable to send a verification code. Please try again.",
        );
      },
      requestConfig: {
        url: userType === "buyer" ? "/accounts/register" : "/accounts/register/manufacturer/",
        method: "POST",
        body: {
          ...formData,
        },
        userType: userType,
        suppressErrorNotification: userType !== "admin",
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
              type="email"
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
            {loading ? <LoadingSpinner /> : "Send code"}
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
        isOpen={showExistingEmailModal}
        result="error"
        title="Email already exist"

        message={`To create a new ${userType === "seller" ? "seller" : "buyer"} account, you must use an email address that isn't already linked to an existing profile.`}
        buttenText="Use Different Email"
        onConfirm={() => setShowExistingEmailModal(false)}
        onCancel={() => setShowExistingEmailModal(false)}
      />
    </div>
  );
}

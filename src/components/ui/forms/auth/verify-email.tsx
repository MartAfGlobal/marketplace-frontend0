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

export interface RegProps {
  userType: "seller" | "buyer";
  token?: string;
  businessType?: "registered" | "individual";
}

export default function VerifyEmail({ userType, token }: RegProps) {
  const [formData, setFormData] = useState<VerifyParams>({
    email: "",
  });

  const dispatch =useDispatch();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const router = useRouter();

  const { loading, error, sendHttpRequest: registerUserReq } = useHttp();

  const email = formData.email;

  const registerUserRes = (res: any) => {
    dispatch(registrationActions.setEmail(email));
    router.push(
      `/auth/seller/sign-up/email-verification-sent?email=${encodeURIComponent(email)}`,
    );
    
  };

  useEffect(() => {
    if (!error) return;
    console.log("Error message:", error);

    if (error.includes("verification message has already been sent")) {
      router.push(
        `/auth/seller/sign-up/email-verification-sent?email=${encodeURIComponent(email)}`,
      );
      dispatch(registrationActions.setEmail(email));
    }
  }, [error, email, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        userType: userType,
        successMessage: "Verification email sent successfully",
      },
    });

    console.log("Registration data:", { ...formData });
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
              className="h-c24 w-24"
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
      </div>
    </div>
  );
}

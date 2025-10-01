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
import { RegisterParams } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useHttp } from "@/hooks/use-http";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterParams>({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const router = useRouter();

  const { loading, sendHttpRequest: registerUserReq } = useHttp();

  const registerUserRes = (res: any) => {
    router.push(`/auth/login`);
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
        url: "/accounts/register",
        method: "POST",
        body: {
          ...formData,
        },
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
    formData.email !== "" &&
    formData.email.includes("@") &&
    formData.password !== "";

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsSubmitting(true);
  //   };

  return (
    <div className=" w-full h-full">
      <div className="h-full w-ful">
        <form className="" onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <div className="flex flex-col gap-2 pt-2">
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
            <div className="flex flex-col gap-2 pt-3 ">
              <Label className="text-c12 font-MontserratMedium ">
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                icon={
                  <button type="button" onClick={toggleVisibility}>
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
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
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                }
                id="confirm_password"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData({ ...formData, confirm_password: e.target.value })
                }
                className=""
              />
            </div>
          </fieldset>
          <Button type="submit" disabled={loading || !isFormValid}>
            {loading ? <LoadingSpinner /> : "Create Account"}
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

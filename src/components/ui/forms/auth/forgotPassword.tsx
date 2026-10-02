"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { useState } from "react";
import Image from "next/image";

import Email from "@/assets/FormIcon/email.svg";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePasswordResetCooldown } from "@/hooks/usePasswordResetCooldown";

export default function ForgotPassword({userType}: {userType: "seller" | "buyer"}) {
  const [email, setEmail] = useState("");
  const isFormValid = email !== "";
  const { recordSuccessfulSend } = usePasswordResetCooldown(userType, email);

  const router = useRouter();

  

  const { loading, sendHttpRequest: UseremailingReq } = useHttp();

  const registerUserRes = (res: any) => {
    recordSuccessfulSend();
    router.push(
  userType === "buyer"
    ? `/auth/password-reset-sent?email=${encodeURIComponent(email)}`
    : `/auth/seller/password-reset-sent?email=${encodeURIComponent(email)}`
);;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    const url = userType === "seller" ? "/accounts/manufacturer/forgot-password/" : "/accounts/forgot-password/";

    UseremailingReq({
      successRes: registerUserRes,
      requestConfig: {
        url: url,
        method: "POST",
        body: {
          email,
        },
        userType: userType,
        successMessage: "Password reset link sent.",
      },
    });

    console.log("reset form data:", { email });
  };



  return (
    <div className="full">
      <form onSubmit={handleSubmit} className="full">
        <fieldset disabled={loading}>
          <div className="flex flex-col gap-2 pt-4 mb-c32">
            <Label className="text-c12 font-MontserratMedium ">email</Label>
            <Input
              icon={<Image src={Email} alt="email" width={20} height={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-efefef "
            />
          </div>
        </fieldset>
        <Button type="submit" disabled={!isFormValid || loading}>
          {loading ? <LoadingSpinner /> : "Send reset link"}
        </Button>
      </form>

      <div className="font-MontserratMedium text-c12 flex gap-1 items-center justify-center mt-c24">
        {!loading && (
          <Link href={userType === "seller" ? "/auth/seller/login" : "/auth/login"} className="text-ff715b">
            Return to login
          </Link>
        )}
      </div>
    </div>
  );
}

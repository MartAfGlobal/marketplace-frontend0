"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../../loading-spinner";

export default function RecoveryEmailSent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleReturnToSignIn = (e: React.FormEvent) => {
    e.preventDefault(); // prevent form submission
    router.push("/auth/login"); // navigate to login page
  };

  const registerUserRes = (res: any) => {
    toast.success("verification link resents");
  };

  const { loading, sendHttpRequest: resendUserReq } = useHttp();

  const handleResentLink = (e: React.FormEvent) => {
    e.preventDefault();
    resendUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/forgot-password/",
        method: "POST",
        body: { email },
        userType: "buyer",
        successMessage: "verification link resent.",
      },
    });
  };

  return (
    <div className="full">
      <form className="full">
        <p className="text-base font-MontserratSemiBold text-center mt-c8 mb-c24 text-161616">
          {email}
        </p>
        <Button onClick={handleResentLink} type="button">{loading ? <LoadingSpinner/>:"Resend email link"}</Button>
      </form>

      {/* <div className="mt-3">
        <Button
          onClick={handleResentLink}
          className="text-ff715b bg-transparent border-0 hover:bg-tr"
        >
          {loading ? "resending" : "Resend recovery link"}
        </Button>
      </div> */}

      <div className=" flex justify-center items-center mt-4 ">
        <Link
          href="/auth/forgot-password"
          className="text-[#6A0DAD] font-MontserratSemiBold leading-[24px]"
        >
          Change email
        </Link>
      </div>
    </div>
  );
}

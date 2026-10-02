"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../../loading-spinner";
import { usePasswordResetCooldown } from "@/hooks/usePasswordResetCooldown";

export default function RecoveryEmailSent({ userType }: { userType: "seller" | "buyer" }) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { timer, recordSuccessfulSend } = usePasswordResetCooldown(userType, email || "");

  const handleReturnToSignIn = (e: React.FormEvent) => {
    e.preventDefault(); // prevent form submission
    router.push("/auth/login"); // navigate to login page
  };

  const registerUserRes = (res: any) => {
    recordSuccessfulSend();
    toast.success("verification link resents");
  };


  const { loading, sendHttpRequest: resendUserReq } = useHttp();
  const url = userType === "seller" ? "/accounts/manufacturer/forgot-password/" : "/accounts/forgot-password/";

  const handleResentLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || timer > 0) return;
    resendUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: url,
        method: "POST",
        body: { email },
        userType: userType,
      },
    });
  };

  return (
    <div className="full">
      <form className="full">
        <p className="text-base font-MontserratSemiBold text-center mt-c8 mb-c24 text-161616">
          {email}
        </p>
        <Button onClick={handleResentLink} type="button" disabled={loading || timer > 0}>
          {loading ? (
            <LoadingSpinner />
          ) : timer > 0 ? (
            `Resend email link in (${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")})`
          ) : (
            "Resend email link"
          )}
        </Button>
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
          href={ userType ==="buyer" ? "/auth/forgot-password": userType ==="seller" ? "/auth/seller/forgot-password" : "/auth/admin/forgot-password"}
          className="text-[#6A0DAD] font-MontserratSemiBold leading-[24px]"
        >
          Change email
        </Link>
      </div>
    </div>
  );
}

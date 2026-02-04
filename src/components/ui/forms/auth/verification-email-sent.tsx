"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../../loading-spinner";
import { useEffect, useState } from "react";

export interface RegProps {
  userType: "seller" | "buyer";
}

const RESEND_TIMEOUT = 120; // 2 minutes (seconds)

export default function VerificationEmailSent({ userType }: RegProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT);

  /* ===============================
     TIMER LOGIC
  =============================== */
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const resetTimer = () => {
    setSecondsLeft(RESEND_TIMEOUT);
  };

  /* ===============================
     EMAIL APP REDIRECT
  =============================== */

  const handleReturnToSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    const domain = email.split("@")[1];

    let emailUrl = "mailto:" + email;

    if (domain?.includes("gmail")) emailUrl = "https://mail.google.com";
    else if (domain?.includes("yahoo")) emailUrl = "https://mail.yahoo.com";
    else if (domain?.includes("outlook") || domain?.includes("hotmail"))
      emailUrl = "https://outlook.live.com";

    window.open(emailUrl, "_blank");
  };

  /* ===============================
     RESEND EMAIL
  =============================== */

  const registerUserRes = () => {
    toast.success("Verification link resent");
    resetTimer();
  };

  const { loading, sendHttpRequest: resendUserReq } = useHttp();

  const handleResentLink = (e: React.FormEvent) => {
    e.preventDefault();

    resendUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/manufacturer/resend-verification-email/",
        method: "POST",
        body: { email },
        userType,
        successMessage: "Verification link resent",
      },
    });
  };

  /* ===============================
     FORMAT TIMER
  =============================== */
  
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="full">
      {/* GO TO EMAIL */}
      <form className="full" onSubmit={handleReturnToSignIn}>
        <p className="text-base font-MontserratSemiBold text-center mt-c8 mb-c24 text-161616">
          {email}
        </p>
        <Button type="submit">Go to email app</Button>
      </form>

      {/* RESEND BUTTON */}
      <div className="mt-3 text-center">
        <Button
          onClick={handleResentLink}
          disabled={secondsLeft > 0 || loading}
          className="text-ff715b bg-transparent border-0 hover:bg-tr disabled:opacity-50 text-sm font-MontserratSemiBold"
        >
          {loading ? (
            <LoadingSpinner color="border-ff715b"/>
          ) : secondsLeft > 0 ? (
            `Resend in ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
          ) : (
            "Resend verification link"
          )}
        </Button>
      </div>

      {/* FOOTER */}
      <div className="font-MontserratMedium text-c12 justify-center mt-c24 px-c42">
        <p className="text-161616 text-center">
          If you haven't received the email, check your spam folder or{" "}
          <Link href="/auth/register" className="text-ff715b">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

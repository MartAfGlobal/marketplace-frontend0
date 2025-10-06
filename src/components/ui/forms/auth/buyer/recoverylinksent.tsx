"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";



export default function RecoveryEmailSent() {
  const router = useRouter();

    const searchParams = useSearchParams();
    const email = searchParams.get("email");

  const handleReturnToSignIn = (e: React.FormEvent) => {
    e.preventDefault(); // prevent form submission
    router.push("/auth/login"); // navigate to login page
  };

   const registerUserRes = (res: any) => {
   toast.success("verification link resents")
  };

    const { loading, sendHttpRequest: resendUserReq } = useHttp();

    const handleResentLink =(e: React.FormEvent)=>{
      e.preventDefault()
      resendUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/resend-verification-email/",
        method: "POST",
        body: {email},
        
        successMessage: "verification link resent.",
      },
    });
  }

  return (
    <div className="full">
      <form className="full" onSubmit={handleReturnToSignIn}>
        <p className="text-base font-MontserratSemiBold text-center mt-c8 mb-c24 text-161616">
          {email}
        </p>
        <Button type="submit">Return to sign in</Button>
      </form>

      <div className="mt-3">
        <Button onClick={handleResentLink} className="text-ff715b bg-transparent border-0 hover:bg-tr">
          {loading? "resending":"Resend recovery link"}
        </Button>
      </div>

      <div className="font-MontserratMedium text-c12 justify-center mt-c24 px-c42">
        <p className="text-161616 text-center">
          If you haven't received the email, check your spam folder{" "}
          <span>
            <Link href="/auth/register" className="text-ff715b">
              Sign up
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
}

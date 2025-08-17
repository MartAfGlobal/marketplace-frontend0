"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../Button/Button";

export default function RecoveryEmailSent() {
  const router = useRouter();

  const handleReturnToSignIn = (e: React.FormEvent) => {
    e.preventDefault(); // prevent form submission
    router.push("/auth/login"); // navigate to login page
  };

  return (
    <div className="full">
      <form className="full" onSubmit={handleReturnToSignIn}>
        <p className="text-base font-MontserratSemiBold text-center mt-c8 mb-c24 text-161616">
          Testemail@gmail.com
        </p>
        <Button type="submit">Return to sign in</Button>
      </form>

      <div className="mt-3">
        <Button className="text-ff715b bg-transparent border-0 hover:bg-tr">
          Resend recovery link
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

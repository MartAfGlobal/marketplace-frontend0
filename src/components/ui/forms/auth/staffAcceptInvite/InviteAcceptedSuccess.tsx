"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button/Button";
import SuccessIcon from "@/assets/icons/staffInviteSuccess.svg";

// Step 3 — purely presentational. The account was already activated and
// logged in by VerifyOtpForm's successful call to
// departments/staff-management/accept-invite/verify-otp/, so "Continue"
// just drops them into the dashboard.
export default function InviteAcceptedSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <div className="w-full flex flex-col items-center">
      <Image
        src={SuccessIcon}
        alt="Registration complete"
        width={374}
        height={154}
        className="w-full max-w-[374px] h-auto mb-8"
      />

      <h2 className="font-MontserratSemiBold text-c18 text-161616 text-center pb-1">Registration complete</h2>
      <p className="text-base font-MontserratNormal text-000000/68 text-center">Welcome to the team!</p>
      <p className="font-MontserratBold text-c16 text-161616 text-center break-all mt-1 mb-8">{email}</p>

      <Button onClick={() => router.push("/dashboard/admin")} className="w-full">
        Continue
      </Button>
    </div>
  );
}

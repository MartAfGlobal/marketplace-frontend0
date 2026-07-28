import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import OtpVerification from "@/components/ui/forms/auth/otpVerification";
import { Suspense } from "react";

export default function OtpVerificationPage() {
  return (
    <AuthenticationLayout
      userType="buyer"
      title="Enter verification code"
      description="We sent a 6-digit code to your email"
    >
      <div>
        <Suspense fallback={<div />}>
          <OtpVerification />
        </Suspense>
      </div>
    </AuthenticationLayout>
  );
}

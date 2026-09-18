import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import VerifyOtpForm from "@/components/ui/forms/auth/staffAcceptInvite/VerifyOtpForm";
import { Suspense } from "react";

export default function StaffAcceptInviteVerifyOtpPage() {
  return (
    <AuthenticationLayout
      userType="admin"
      title="Enter OTP"
      description="We've sent a 6-digit code to your email. Enter it below to continue."
    >
      <div>
        <Suspense fallback={<div />}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </AuthenticationLayout>
  );
}

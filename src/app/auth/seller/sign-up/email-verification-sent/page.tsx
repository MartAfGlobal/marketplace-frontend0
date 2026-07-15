import { Suspense } from "react";
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import VerificationEmailSent from "@/components/ui/forms/auth/verification-email-sent";

type UserType = "buyer" | "seller";

const AUTH_CONTENT: Record<UserType, { title: string; description: string }> = {
  buyer: {
    title: "Enter verification code",
    description: "We've sent a 6-digit code to your email. Enter it below to continue.",
  },
  seller: {
    title: "Enter verification code",
    description: "We've sent a 6-digit code to your email. Enter it below to continue.",
  },
};

export default function RegistrationPage() {
  const userType: UserType = "seller";

  return (
    <AuthenticationLayout userType={userType}
      title={AUTH_CONTENT[userType].title}
      description={AUTH_CONTENT[userType].description}
    >
      <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center font-MontserratMedium">Loading...</div>}>
        <VerificationEmailSent userType={userType} />
      </Suspense>
    </AuthenticationLayout>
  );
}

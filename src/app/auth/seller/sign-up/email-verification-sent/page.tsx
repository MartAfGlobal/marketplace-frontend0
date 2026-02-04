import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import VerificationEmailSent from "@/components/ui/forms/auth/verification-email-sent";


type UserType = "buyer" | "seller";

const AUTH_CONTENT: Record<UserType, { title: string; description: string }> = {
  buyer: {
    title: "Verify email address",
    description: "We’ve sent a link to your email at",
  },
  seller: {
    title: "Verify email address",
    description: "We’ve sent a link to your email at",
  },
};

export default function RegistrationPage() {
  const userType: UserType = "seller"; // or from route / state

  return (
    <AuthenticationLayout userType={userType}
      title={AUTH_CONTENT[userType].title}
      description={AUTH_CONTENT[userType].description}
    >
      <VerificationEmailSent userType={userType} />
    </AuthenticationLayout>
  );
}

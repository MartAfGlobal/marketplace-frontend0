// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import RecoveryEmailSent from "@/components/ui/forms/auth/recoverylinksent";

export default function LoginPage() {
  return (
    <AuthenticationLayout
      userType="buyer"
      title="Forgot password"
      description="We’ve sent a recovery link to your email at"
    >
      <div>
        <>
          <RecoveryEmailSent />
        </>
      </div>
    </AuthenticationLayout>
  );
}

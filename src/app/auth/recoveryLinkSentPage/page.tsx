// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import RecoveryEmailSent from "@/components/ui/forms/auth/buyer/recoverylinksent";



export default function LoginPage() {
  return (
    <AuthenticationLayout
      title="Forgot password"
      description="We’ve sent a recovery link to your email at"
    >
      <div>
        <>
        <RecoveryEmailSent/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

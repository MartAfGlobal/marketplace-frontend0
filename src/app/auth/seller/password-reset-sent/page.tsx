// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import RecoveryEmailSent from "@/components/ui/forms/auth/recoverylinksent";



export default function forgotPasswordPage() {
  return (
    <AuthenticationLayout userType="seller"
      title="Check your inbox"
      description="if there’s an account associated with that email, you’ll receive a reset link shortly."
    >
      <div>
        <>
        <RecoveryEmailSent userType="seller"/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

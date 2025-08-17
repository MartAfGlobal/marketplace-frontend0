// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import ForgotPassword from "@/components/ui/forms/auth/forgotPassword";



export default function forgotPasswordPage() {
  return (
    <AuthenticationLayout
      title="Forgot password"
      description="We’d send a recovery link to your email address"
    >
      <div>
        <>
        <ForgotPassword/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

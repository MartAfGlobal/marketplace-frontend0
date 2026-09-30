// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import ForgotPassword from "@/components/ui/forms/auth/forgotPassword";



export default function forgotPasswordPage() {
  return (
    <AuthenticationLayout
    userType="buyer"
      title="Forgot password"
      description="We’ll send a verification code to your email address to reset your password."
    >
      <div>
        <>
        <ForgotPassword/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

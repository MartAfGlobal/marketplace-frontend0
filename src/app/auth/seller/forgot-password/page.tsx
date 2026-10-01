// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import ForgotPassword from "@/components/ui/forms/auth/forgotPassword";



export default function forgotPasswordPage() {
  return (
    <AuthenticationLayout
    userType="seller"
      title="Forgot password"
      description="We’ll send a verification code to your email address to reset your password."
    >
      <div>
        <>
        <ForgotPassword userType="seller"/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

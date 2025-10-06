// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";

import ResetPasswordForm from "@/components/ui/forms/auth/buyer/resetPassword";



export default function ResetPasswordPage() {
  return (
    <AuthenticationLayout
      title="Reset your password"
      description="Enter a new password for your account"
    >
      <div>
        <>
        <ResetPasswordForm/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

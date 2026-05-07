import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import LoginForm from "@/components/ui/forms/auth/loginForm";

export default function LoginPage() {
  return (
    <AuthenticationLayout
      userType="seller"
      title="Sign in"
      description="Sign in to start selling your goods"
    >
      <div>
        <>
          <LoginForm userType="seller" />
        </>
      </div>
    </AuthenticationLayout>
  );
}

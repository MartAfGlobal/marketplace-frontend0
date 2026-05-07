import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import LoginForm from "@/components/ui/forms/auth/loginForm";

export default function LoginPage() {
  return (
    <AuthenticationLayout
      userType="buyer"
      title="Sign in"
      description="Sign in to start working in our services"
    >
      <div>
        <>
          <LoginForm userType="buyer" />
        </>
      </div>
    </AuthenticationLayout>
  );
}

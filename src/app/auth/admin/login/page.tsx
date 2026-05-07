import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import LoginForm from "@/components/ui/forms/auth/loginForm";

export default function AdminLoginPage() {
  return (
    <AuthenticationLayout
      userType="admin"
      title="Sign in"
      description="Sign in to start working in our services"
    >
      <div>
        <>
          <LoginForm userType="admin" />
        </>
      </div>
    </AuthenticationLayout>
  );
}

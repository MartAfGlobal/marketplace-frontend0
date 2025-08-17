// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import LoginForm from "@/components/ui/forms/auth/loginForm";



export default function LoginPage() {
  return (
    <AuthenticationLayout
      title="Sign in"
      description="Sign in to start enjoying our services"
    >
      <div>
        <>
        <LoginForm/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

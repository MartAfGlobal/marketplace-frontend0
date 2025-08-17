// app/(auth)/login/page.tsx
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import RegisterForm from "@/components/ui/forms/auth/registerForm";



export default function RegistrationPage() {
  return (
    <AuthenticationLayout
      title="Sign up"
      description="Welcome to MartAf, let’s get you started"
    >
      <div>
        <>
        <RegisterForm/>
        </>
      </div>
    </AuthenticationLayout>
  );
}

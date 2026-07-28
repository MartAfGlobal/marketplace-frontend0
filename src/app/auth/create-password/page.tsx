import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import CreatePasswordForm from "@/components/ui/forms/auth/createPassword";
import { Suspense } from "react";

export default function CreatePasswordPage() {
  return (
    <AuthenticationLayout
      userType="buyer"
      title="Create new password"
      description="Your new password must meet the security requirements"
    >
      <div>
        <Suspense fallback={<div />}>
          <CreatePasswordForm />
        </Suspense>
      </div>
    </AuthenticationLayout>
  );
}

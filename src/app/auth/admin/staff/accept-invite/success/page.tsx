import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import InviteAcceptedSuccess from "@/components/ui/forms/auth/staffAcceptInvite/InviteAcceptedSuccess";
import { Suspense } from "react";

export default function StaffAcceptInviteSuccessPage() {
  return (
    <AuthenticationLayout userType="admin" title="" description="">
      <div>
        <Suspense fallback={<div />}>
          <InviteAcceptedSuccess />
        </Suspense>
      </div>
    </AuthenticationLayout>
  );
}

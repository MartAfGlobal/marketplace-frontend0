import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import SetPasswordForm from "@/components/ui/forms/auth/staffAcceptInvite/SetPasswordForm";
import { Suspense } from "react";

// Matches settings.FRONTEND_STAFF_INVITE_URL on the backend exactly —
// StaffInviteView / StaffResendInviteView (departments/rbac_views.py) link
// straight here with ?token=...&email=....
export default function StaffAcceptInvitePage() {
  return (
    <AuthenticationLayout userType="admin" title="Welcome to the team!" description="">
      <div>
        <Suspense fallback={<div />}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </AuthenticationLayout>
  );
}

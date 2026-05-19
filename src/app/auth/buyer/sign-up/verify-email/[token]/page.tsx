"use client";

import { useParams } from "next/navigation";
import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";
import RegisterForm from "@/components/ui/forms/auth/registerForm";
import { registrationActions } from "@/store/auth/registration-slice";
import { useDispatch } from "react-redux";

type UserType = "buyer" | "seller";

export default function RegistrationPage() {
  const params = useParams();
  const token = params?.token as string;
  const dispatch = useDispatch();

  const userType: UserType = "buyer";

  if (!token) {
    return <div>Invalid or expired registration link</div>;
  } else {
    dispatch(registrationActions.setToken(token));
  }

  return (
    <AuthenticationLayout
      userType={userType}
      stage={1}
      title="Personal details"
      description="Add your phone number and create your password"
    >
      <RegisterForm userType={userType} token={token} />
    </AuthenticationLayout>
  );
}

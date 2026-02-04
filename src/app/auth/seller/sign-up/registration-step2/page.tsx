"use client";


import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";


import RegisterFormStep2 from "@/components/ui/forms/auth/registrationStep2";

type UserType = "buyer" | "seller";

export default function RegistrationPage() {


  const userType: UserType = "seller";



  return (
    <AuthenticationLayout
      userType={userType}
      stage={2}
      title="Shop information"
      description="Setup your basic shop information"
    >
      <RegisterFormStep2 userType={userType}  />
    </AuthenticationLayout>
  );
}

"use client";


import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";


import RegisterFormStep2 from "@/components/ui/forms/auth/registrationStep2";
import RegisterFormStep3 from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/registeredBusinessnessForm";

type UserType = "buyer" | "seller";

export default function RegistrationPage() {


  const userType: UserType = "seller";
  const businessType = "registered";



  return (
    <AuthenticationLayout
      userType={userType }
      className="w-full max-w-163.25 "
      stage={3}
      title="Basic business information"
      description="Setup your business information"
    >
      <RegisterFormStep3 userType={userType}   businessType={businessType}  />
    </AuthenticationLayout>
  );
}

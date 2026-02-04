"use client";

import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout";

import RegisterFormStep2 from "@/components/ui/forms/auth/registrationStep2";
import RegisterIndividual3 from "@/components/ui/forms/auth/sellers/registrastionSteps/registration-individual-seller/individualBusinessForm";

type UserType = "buyer" | "seller";

export default function RegistrationPage() {
  const userType: UserType = "seller";
  const businessType = "unregistered";

  return (
    <AuthenticationLayout
    className="w-full max-w-163.25 "
      userType={userType}
      stage={3}
      title="Shop information"
      description="Setup your basic shop information"
    >
      <RegisterIndividual3 userType={userType} businessType={businessType} />
    </AuthenticationLayout>
  );
}

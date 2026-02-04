import AuthenticationLayout from "@/components/ui/LayoutWrappers/AuthenticationLayout"

import VerifyEmail from "@/components/ui/forms/auth/verify-email";

type UserType = "buyer" | "seller"

const AUTH_CONTENT: Record<
  UserType,
  { title: string; description: string }
> = {
  buyer: {
    title: "Sign up",
    description: "Welcome to MartAf, create an account to start shopping",
  },
  seller: {
    title: "Sign up ",
    description: "Welcome seller, let’s get you started",
  },
}

export default function RegistrationPage() {
  const userType: UserType = "seller" // or from route / state

  return (
    <AuthenticationLayout userType={userType}
      title={AUTH_CONTENT[userType].title}
      description={AUTH_CONTENT[userType].description}
    >
      <VerifyEmail userType={userType} />
    </AuthenticationLayout>
  )
}

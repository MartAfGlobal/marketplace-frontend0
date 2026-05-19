import { redirect } from "next/navigation";

export default function RegistrationPage() {
  redirect("/auth/buyer/sign-up");
}


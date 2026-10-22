"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function GoogleOAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

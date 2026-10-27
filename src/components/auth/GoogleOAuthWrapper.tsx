"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = (
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "706836279877-6c02iar3unr4r3k3m6umv50herh079v6.apps.googleusercontent.com"
).trim();

export default function GoogleOAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

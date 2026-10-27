"use client";

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import Image from "next/image";
import Google from "@/assets/socialIcons/Google.svg";

interface GoogleSignInButtonProps {
  fromPage?: string | null;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  label?: string;
  className?: string;
}

export default function GoogleSignInButton({
  fromPage,
  onSuccess,
  onError,
  label = "Sign in with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const { handleGoogleCredential, loading } = useGoogleAuth({
    fromPage,
    onSuccess,
    onError,
  });

  return (
    <div
      className={`relative w-full overflow-hidden rounded-c8 border border-161616 h-c48 flex items-center justify-center hover:bg-gray-50 transition-colors ${className}`}
    >
      {/* Visual custom styled button */}
      <div className="flex items-center justify-center gap-2 font-MontserratSemiBold text-base pointer-events-none select-none">
        <Image
          src={Google}
          width={24}
          height={24}
          alt="Google logo"
          className="md:h-c24 md:w-24 h-c32 w-c32"
        />
        <span>{loading ? "Signing in..." : label}</span>
      </div>

      {/* Real Google Login button rendered on top invisibly so the click hits Google's iframe */}
      <div className="absolute inset-0 opacity-[0.001] w-full h-full cursor-pointer flex items-center justify-center overflow-hidden [&>div]:w-full [&>div]:h-full [&_iframe]:!w-full [&_iframe]:!h-full">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              handleGoogleCredential(credentialResponse.credential);
            }
          }}
          onError={() => {
            console.error("Google sign-in popup failed or closed.");
          }}
          width="400"
          size="large"
          theme="outline"
          shape="rectangular"
        />
      </div>
    </div>
  );
}

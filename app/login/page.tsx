"use client";

import { useState, useEffect } from "react";
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      // Simulate API call for login page data
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsPageLoading(false);
    };

    loadPageData();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="animate-pulse">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          {/* Logo Skeleton */}
          <div className="flex justify-center gap-2 md:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Login Form Skeleton */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs space-y-6">
              {/* Title */}
              <div className="space-y-2 text-center">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t bg-gray-200 h-px"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Social Login */}
              <div className="h-10 bg-gray-200 rounded"></div>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image Skeleton */}
      <div className="bg-gray-200 relative hidden lg:block">
        <div className="absolute inset-0 bg-gray-300"></div>
      </div>

      {/* Loading Spinner */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
      </div>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ForgotPasswordConfirmationForm() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  
  // Get email from URL params
  const email = searchParams.get('email') || 'your email';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  // Simulate initial page loading
  useEffect(() => {
    const loadPageData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsPageLoading(false);
    };
    loadPageData();
  }, []);

  const handleResendRecoveryLink = async () => {
    setIsResending(true);
    
    try {
      // Simulate API call to resend recovery link
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Recovery link sent again! Check your email.");
    } catch (error) {
      console.error("Resend recovery link error:", error);
      toast.error("Failed to resend recovery link. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF715B] mx-auto"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white">
      <div className="animate-pulse">
        {/* Logo Skeleton */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-20 h-6 bg-gray-200 rounded"></div>
        </div>

        {/* Content Skeleton */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-sm space-y-6 px-6">
            <div className="space-y-2 text-center">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Pattern Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-100"></div>
      </div>
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF715B]"></div>
      </div>
    </div>
  );

  if (isPageLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Logo in top-left corner */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-[#7C2AE8] text-white rounded w-8 h-8 flex items-center justify-center font-bold text-lg">
            M
          </span>
          <span className="font-bold text-xl tracking-wide text-gray-900">MARTAF</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">Forgot password</h1>
              <div className="space-y-1">
                <p className="text-gray-600">We've sent a recovery link to your email at</p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Return to sign in button */}
              <Link href="/login">
                <Button 
                  className="w-full h-12 bg-[#FF715B] text-white rounded-md font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Return to sign in
                </Button>
              </Link>

              {/* Resend recovery link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendRecoveryLink}
                  disabled={isResending}
                  className={`text-[#FF715B] font-medium ${
                    isResending ? 'cursor-not-allowed opacity-50' : 'hover:underline'
                  }`}
                >
                  {isResending ? (
                    <div className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resending...
                    </div>
                  ) : (
                    "Resend recovery link"
                  )}
                </button>
              </div>

              {/* Help text */}
              <div className="text-center text-sm text-gray-600">
                If you haven't received the email, check your spam folder or{" "}
                <Link 
                  href="/signup"
                  className="text-[#FF715B] font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative footer pattern */}
      <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
        <div className="flex items-center justify-center w-full h-full opacity-10">
          <div className="flex gap-12 animate-pulse">
            {/* African continent shapes */}
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.14 2 5 5.14 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {/* Houses */}
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            {/* Palm trees */}
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L8 8h3v12h2V8h3l-4-6zM6 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            </svg>
            {/* Repeat pattern */}
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.14 2 5 5.14 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L8 8h3v12h2V8h3l-4-6zM6 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            </svg>
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.14 2 5 5.14 5 9c0 4.25 7 13 7 13s7-8.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L8 8h3v12h2V8h3l-4-6zM6 8c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function ForgotPasswordConfirmationPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF715B] mx-auto"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function ForgotPasswordConfirmationPage() {
  return (
    <Suspense fallback={<ForgotPasswordConfirmationPageFallback />}>
      <ForgotPasswordConfirmationForm />
    </Suspense>
  );
} 
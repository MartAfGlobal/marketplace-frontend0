"use client";

import { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ForgotEmailForm() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{phoneNumber?: string}>({});

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

  const validateForm = () => {
    const newErrors: {phoneNumber?: string} = {};
    
    if (!phoneNumber) {
      newErrors.phoneNumber = "Mobile number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid mobile number";
    } else if (phoneNumber.replace(/\D/g, '').length < 10) {
      newErrors.phoneNumber = "Mobile number must be at least 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendRecoveryLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call to send partial email to phone
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract partial phone number for display (mask middle digits)
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const maskedPhone = cleanPhone.length > 6 
        ? `+${cleanPhone.slice(0, 6)}${'*'.repeat(cleanPhone.length - 8)}${cleanPhone.slice(-2)}`
        : phoneNumber;
      
      toast.success("Partial email address sent to your phone!");
      
      // You could redirect to a confirmation page showing the masked phone number
      // For now, we'll just show success and reset form
      setPhoneNumber("");
      
    } catch (error) {
      console.error("Send recovery link error:", error);
      toast.error("Failed to send recovery information. Please try again.");
    } finally {
      setIsLoading(false);
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

        {/* Form Skeleton */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-sm space-y-6 px-6">
            <div className="space-y-2 text-center">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="text-center">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
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
          <form onSubmit={handleSendRecoveryLink} className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">Forgot email</h1>
              <div className="space-y-1">
                <p className="text-gray-600">We'd send a partial email address to your</p>
                <p className="text-gray-600">registered number +234703*****12</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Mobile number field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Mobile number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    id="phoneNumber"
                    type="tel" 
                    placeholder="" 
                    value={phoneNumber} 
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) {
                        setErrors(prev => ({ ...prev, phoneNumber: undefined }));
                      }
                    }}
                    className={`h-12 rounded-md pl-10 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF715B] focus:border-[#FF715B]'}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Send recovery link button */}
              <Button 
                type="submit"
                className="w-full h-12 bg-[#FF715B] text-white rounded-md font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending recovery link...
                  </div>
                ) : (
                  "Send recovery link"
                )}
              </Button>
            </div>

            {/* Return to login link */}
            <div className="text-center text-sm">
              {isLoading ? (
                <span className="text-[#FF715B] font-medium cursor-not-allowed opacity-50">
                  Return to login
                </span>
              ) : (
                <Link 
                  href="/login"
                  className="text-[#FF715B] font-medium hover:underline"
                >
                  Return to login
                </Link>
              )}
            </div>
          </form>
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
function ForgotEmailPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF715B] mx-auto"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function ForgotEmailPage() {
  return (
    <Suspense fallback={<ForgotEmailPageFallback />}>
      <ForgotEmailForm />
    </Suspense>
  );
} 
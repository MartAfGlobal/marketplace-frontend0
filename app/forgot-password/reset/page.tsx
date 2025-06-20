"use client";

import { useState, useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; confirmPassword?: string}>({});
  
  // Get token and email from URL params
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, router]);

  // Set email from URL params
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Invalid reset link. Please request a new password reset.");
        router.push('/forgot-password');
        return;
      }

      try {
        // Simulate token validation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // If token is invalid, redirect
        const isValidToken = true; // Replace with actual token validation
        if (!isValidToken) {
          toast.error("Reset link has expired. Please request a new password reset.");
          router.push('/forgot-password');
          return;
        }
        
        setIsPageLoading(false);
      } catch (error) {
        console.error("Token validation error:", error);
        toast.error("Invalid reset link. Please request a new password reset.");
        router.push('/forgot-password');
      }
    };

    validateToken();
  }, [token, router]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string; confirmPassword?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call to reset password
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Password reset successful! You can now sign in with your new password.");
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
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
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded"></div>
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
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Create your new password</h1>
              <p className="text-gray-600">Chose a safe, easy to remember and secure password</p>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="" 
                    value={email} 
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    className={`h-12 rounded-md pr-10 bg-gray-50 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF715B] focus:border-[#FF715B]'}`}
                    disabled={isLoading || !!emailParam}
                    readOnly={!!emailParam}
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="" 
                    value={password} 
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    className={`h-12 rounded-md pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF715B] focus:border-[#FF715B]'}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="" 
                    value={confirmPassword} 
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    className={`h-12 rounded-md pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FF715B] focus:border-[#FF715B]'}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Continue button */}
              <Button 
                type="submit"
                className="w-full h-12 bg-[#FF715B] text-white rounded-md font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating password...
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
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
function ResetPasswordPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF715B] mx-auto"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordPageFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
} 
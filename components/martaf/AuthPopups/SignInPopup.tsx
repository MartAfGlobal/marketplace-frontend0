"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SignInPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onGoogleSignIn: () => void;
  onSuccess: () => void;
}

export function SignInPopup({ 
  open, 
  onOpenChange, 
  onSignUp, 
  onForgotPassword,
  onGoogleSignIn,
  onSuccess
}: SignInPopupProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login({
        email,
        password,
        remember_me: rememberMe
      });
      
      onSuccess();
      // Reset form
      setEmail("");
      setPassword("");
      setRememberMe(false);
    } catch (error) {
      console.error("Sign in error:", error);
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Simulate Google sign-in process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Google sign-in successful!");
      onGoogleSignIn();
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRememberMe(false);
    setErrors({});
    setIsLoading(false);
    setIsGoogleLoading(false);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100"
              onClick={handleClose}
              disabled={isLoading || isGoogleLoading}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">
              Sign In
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">Welcome back to Africa's largest marketplace</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                className={`h-12 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                disabled={isLoading || isGoogleLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  className={`h-12 rounded-lg pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                  disabled={isLoading || isGoogleLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#FF715B] border-gray-300 rounded focus:ring-[#FF715B]"
                  disabled={isLoading || isGoogleLoading}
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <span 
                className={`text-sm text-[#FF715B] font-medium ${
                  isLoading || isGoogleLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:underline'
                }`}
                onClick={() => !isLoading && !isGoogleLoading && onForgotPassword()}
              >
                Forgot password?
              </span>
            </div>

            <Button 
              className="w-full h-12 bg-[#FF715B] text-white rounded-lg font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-12 rounded-lg border-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <span 
                className={`text-[#FF715B] font-medium ${
                  isLoading || isGoogleLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:underline'
                }`}
                onClick={() => !isLoading && !isGoogleLoading && onSignUp()}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 
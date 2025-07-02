"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Label } from "@/components/ui/label";

interface SignUpPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: (email: string) => void;
  onGoogleSignIn: () => void;
  onSignInLink: () => void;
}

export function SignUpPopup({
  open,
  onOpenChange,
  onSignIn,
  onGoogleSignIn,
  onSignInLink,
}: SignUpPopupProps) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

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
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        email,
        password,
        confirm_password: confirmPassword,
        is_customer: true,
        is_manufacturer: false,
      });

      onSignIn(email);
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error);
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Simulate Google sign-in process
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
    setErrors({});
    setIsLoading(false);
    setIsGoogleLoading(false);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto max-h-[95vh] overflow-hidden">
        <DrawerHeader className="border-b p-4 flex-shrink-0">
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
              Create Account
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Join the largest African marketplace
            </p>
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
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                className={`h-12 rounded-lg ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
                disabled={isLoading || isGoogleLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password (min. 8 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                className={`h-12 rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
                disabled={isLoading || isGoogleLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                className={`h-12 rounded-lg ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                }`}
                disabled={isLoading || isGoogleLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              className="w-full h-12 bg-[#FF715B] text-white rounded-lg font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSignUp}
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
           

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with
                </span>
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
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className={`text-[#FF715B] font-medium ${
                  isLoading || isGoogleLoading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:underline"
                }`}
                onClick={() => !isLoading && !isGoogleLoading && onSignInLink()}
              >
                Sign in
              </span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";

interface ResetPasswordPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  token?: string;
}

export function ResetPasswordPopup({ open, onOpenChange, onBack, token }: ResetPasswordPopupProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{password?: string; confirmPassword?: string}>({});

  const validateForm = () => {
    const newErrors: {password?: string; confirmPassword?: string} = {};
    
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

  const handleResetPassword = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    if (!token) {
      toast.error("Invalid reset token. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}reset-password-confirm/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful! You can now sign in with your new password.");
        setPassword("");
        setConfirmPassword("");
        onBack(); // Go back to sign up
      } else {
        if (data.password) {
          setErrors(prev => ({ ...prev, password: data.password[0] }));
        }
        toast.error(data.message || data.detail || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setIsLoading(false);
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
              onClick={() => !isLoading && onBack()}
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">
              Set New Password
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Enter your new password below. Make sure it's at least 8 characters long.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="New password (min. 8 characters)" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  className={`h-12 rounded-lg pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
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

            <div>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password" 
                  value={confirmPassword} 
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  className={`h-12 rounded-lg pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
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
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <Button 
              className="w-full h-12 bg-[#FF715B] text-white rounded-lg font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </div>
              ) : (
                "Update Password"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <span 
                className={`text-[#FF715B] font-medium ${
                  isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:underline'
                }`}
                onClick={() => !isLoading && onBack()}
              >
                Back to Sign In
              </span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 
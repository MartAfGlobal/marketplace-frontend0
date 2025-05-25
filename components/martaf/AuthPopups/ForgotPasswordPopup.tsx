"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ForgotPasswordPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function ForgotPasswordPopup({ open, onOpenChange, onBack }: ForgotPasswordPopupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset email sent! Please check your inbox.");
        setEmail("");
        onBack(); // Go back to sign up
      } else {
        if (data.email) {
          setErrors(prev => ({ ...prev, email: data.email[0] }));
        }
        toast.error(data.message || data.detail || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
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
              Reset Password
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
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
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                className={`h-12 rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                  Sending Reset Link...
                </div>
              ) : (
                "Send Reset Link"
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
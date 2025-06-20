"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

interface VerifyEmailPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function VerifyEmailPopup({ open, onOpenChange, onBack }: VerifyEmailPopupProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{code?: string}>({});

  const validateForm = () => {
    const newErrors: {code?: string} = {};
    
    if (!code) {
      newErrors.code = "Verification code is required";
    } else if (code.length !== 6) {
      newErrors.code = "Verification code must be 6 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyEmail = async () => {
    if (!validateForm()) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call for email verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll assume verification is successful
      toast.success("Email verified successfully!");
      setCode("");
      onBack(); // Go back to sign up
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error("Invalid verification code. Please try again.");
      setErrors({ code: "Invalid verification code" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      // Simulate API call for resending code
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Verification code sent! Please check your email.");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setErrors({});
    setIsLoading(false);
    setIsResending(false);
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
              onClick={() => !isLoading && !isResending && onBack()}
              disabled={isLoading || isResending}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">
              Verify Email
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to your email address. 
              Please enter it below to verify your account.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input 
                type="text" 
                placeholder="Enter 6-digit code" 
                value={code} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  if (errors.code) {
                    setErrors(prev => ({ ...prev, code: undefined }));
                  }
                }}
                className={`h-12 rounded-lg text-center text-lg tracking-widest ${errors.code ? 'border-red-500' : 'border-gray-200'}`}
                disabled={isLoading || isResending}
                maxLength={6}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>

            <Button 
              className="w-full h-12 bg-[#FF715B] text-white rounded-lg font-medium hover:bg-[#ff4d2d] disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleVerifyEmail}
              disabled={isLoading || isResending}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                className={`text-[#FF715B] font-medium hover:bg-transparent hover:underline disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={handleResendCode}
                disabled={isLoading || isResending}
              >
                {isResending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resending...
                  </div>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 
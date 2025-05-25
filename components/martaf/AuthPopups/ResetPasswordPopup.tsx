import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export function ResetPasswordPopup({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      console.log("Starting password reset confirmation...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}reset-password-confirm/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log("Password reset confirmation response:", response);

      if (response.ok) {
        console.log("Password reset successful");
        toast.success("Your password has been reset successfully.");
        onBack();
      } else {
        const error = await response.json();
        console.error("Password reset failed:", error);
        toast.error(error.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
      <p className="mb-6 text-lg text-muted-foreground">Enter your new password below.</p>
      
      <label className="block mb-2 text-base font-medium">New Password</label>
      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔒</span>
        <Input 
          type="password" 
          placeholder="New password" 
          className="pl-10" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
      </div>

      <label className="block mb-2 text-base font-medium">Confirm Password</label>
      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔒</span>
        <Input 
          type="password" 
          placeholder="Confirm password" 
          className="pl-10" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
        />
      </div>

      <Button 
        className="w-full mb-4 bg-[#FF715B] text-white rounded-lg py-3 text-base font-semibold hover:bg-[#ff4d2d] border-none shadow-none" 
        onClick={handleResetPassword}
      >
        Reset Password
      </Button>

      <div className="text-center text-base">
        Remember your password? <span className="text-primary font-semibold cursor-pointer" onClick={onBack}>Back to Sign In</span>
      </div>
    </Card>
  );
} 
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordPopup({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      console.log("Starting password reset process...");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log("Password reset response:", response);

      if (response.ok) {
        console.log("Password reset email sent successfully");
        toast.success("Password reset instructions have been sent to your email.");
        onBack();
      } else {
        const error = await response.json();
        console.error("Password reset failed:", error);
        toast.error(error.message || "Failed to send password reset email. Please try again.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
      <p className="mb-6 text-lg text-muted-foreground">Enter your email address and we'll send you instructions to reset your password.</p>
      
      <label className="block mb-2 text-base font-medium">Email address</label>
      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📧</span>
        <Input 
          type="email" 
          placeholder="Email address" 
          className="pl-10" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
      </div>

      <Button 
        className="w-full mb-4 bg-[#FF715B] text-white rounded-lg py-3 text-base font-semibold hover:bg-[#ff4d2d] border-none shadow-none" 
        onClick={handleForgotPassword}
      >
        Send Reset Instructions
      </Button>

      <div className="text-center text-base">
        Remember your password? <span className="text-primary font-semibold cursor-pointer" onClick={onBack}>Back to Sign In</span>
      </div>
    </Card>
  );
} 
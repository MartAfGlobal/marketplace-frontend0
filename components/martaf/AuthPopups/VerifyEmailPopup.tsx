import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function VerifyEmailPopup({ onBack }: { onBack: () => void }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !uid) {
        toast.error("Invalid verification link.");
        setIsVerifying(false);
        return;
      }

      try {
        console.log("Starting email verification...");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}verify-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, uid }),
        });

        console.log("Email verification response:", response);

        if (response.ok) {
          console.log("Email verified successfully");
          toast.success("Your email has been verified successfully.");
        } else {
          const error = await response.json();
          console.error("Email verification failed:", error);
          toast.error(error.message || "Failed to verify email. Please try again.");
        }
      } catch (error) {
        console.error("Email verification error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, uid]);

  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Verify Email</h2>
      <p className="mb-6 text-lg text-muted-foreground">
        {isVerifying 
          ? "Verifying your email address..." 
          : "Your email verification is complete."}
      </p>

      <Button 
        className="w-full mb-4 bg-[#FF715B] text-white rounded-lg py-3 text-base font-semibold hover:bg-[#ff4d2d] border-none shadow-none" 
        onClick={onBack}
      >
        {isVerifying ? "Verifying..." : "Continue to Sign In"}
      </Button>
    </Card>
  );
} 
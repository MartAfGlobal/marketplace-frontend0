import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AllDonePopup({ onBack }: { onBack: () => void }) {
  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">All Done!</h2>
      <p className="mb-6 text-lg text-muted-foreground">
        Your account has been successfully created. You can now sign in to your account.
      </p>

      <Button 
        className="w-full mb-4 bg-[#FF715B] text-white rounded-lg py-3 text-base font-semibold hover:bg-[#ff4d2d] border-none shadow-none" 
        onClick={onBack}
      >
        Continue to Sign In
      </Button>
    </Card>
  );
} 
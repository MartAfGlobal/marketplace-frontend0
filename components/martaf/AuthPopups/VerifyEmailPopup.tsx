import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VerifyEmailPopup({ onOpenMail, onResend, onChangeEmail }: { onOpenMail: () => void; onResend: () => void; onChangeEmail: () => void; }) {
  return (
    <Card className="w-full max-w-md p-8 mx-auto text-center">
      <h2 className="text-3xl font-bold mb-2">Verify your email address</h2>
      <p className="mb-6 text-lg text-muted-foreground">A verification link has been sent to your email. Check your inbox and click the link to proceed</p>
      <Button className="w-full mb-4" onClick={onOpenMail}>Open mail app</Button>
      <div className="mt-4 text-base">Didn't get the email?</div>
      <div className="flex justify-center gap-4 mt-2">
        <span className="text-primary font-semibold cursor-pointer" onClick={onResend}>Resend verification</span>
        <span className="text-primary font-semibold cursor-pointer" onClick={onChangeEmail}>Change email</span>
      </div>
    </Card>
  );
} 
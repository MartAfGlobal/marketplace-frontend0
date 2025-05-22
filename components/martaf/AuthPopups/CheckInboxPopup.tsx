import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CheckInboxPopup({ onResend, onChangeEmail }: { onResend: () => void; onChangeEmail: () => void; }) {
  return (
    <Card className="w-full max-w-md p-8 mx-auto text-center">
      <h2 className="text-3xl font-bold mb-2">Check your inbox</h2>
      <p className="mb-6 text-lg text-muted-foreground">if there's an account associated with that email, you'll receive a reset link shortly.</p>
      <Button className="w-full mb-4" onClick={onResend}>Resend email link</Button>
      <div className="flex justify-center gap-4 mt-2">
        <span className="text-primary font-semibold cursor-pointer" onClick={onChangeEmail}>Change email</span>
      </div>
    </Card>
  );
} 
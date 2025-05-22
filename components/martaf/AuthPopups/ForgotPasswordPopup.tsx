import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ForgotPasswordPopup({ onSendReset, onBackToLogin }: { onSendReset: (email: string) => void; onBackToLogin: () => void; }) {
  const [email, setEmail] = useState("");
  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Forgot password</h2>
      <p className="mb-6 text-lg text-muted-foreground">Enter your email and we'll send you a reset link.</p>
      <label className="block mb-2 text-base font-medium">Email address</label>
      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📧</span>
        <Input type="email" placeholder="Email address" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <Button className="w-full mb-4" onClick={() => onSendReset(email)}>Send reset link</Button>
      <div className="text-center text-primary font-semibold cursor-pointer" onClick={onBackToLogin}>Back to login</div>
    </Card>
  );
} 
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FinishSignUpPopup({ onFinish }: { onFinish: (password: string, confirmPassword: string) => void; }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Finish signing up</h2>
      <p className="mb-6 text-lg text-muted-foreground">Let's get a few details about you</p>
      <label className="block mb-2 text-base font-medium">New password</label>
      <Input type="password" placeholder="New password" className="mb-4" value={password} onChange={e => setPassword(e.target.value)} />
      <label className="block mb-2 text-base font-medium">Confirm password</label>
      <Input type="password" placeholder="Confirm password" className="mb-6" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <Button className="w-full" onClick={() => onFinish(password, confirmPassword)}>Finish up</Button>
    </Card>
  );
} 
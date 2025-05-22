import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SignUpPopup({ onSignIn, onGoogleSignIn, onSignInLink }: { onSignIn: (email: string) => void; onGoogleSignIn: () => void; onSignInLink: () => void; }) {
  const [email, setEmail] = useState("");
  return (
    <Card className="w-full max-w-md p-8 mx-auto">
      <h2 className="text-3xl font-bold mb-2">Sign up</h2>
      <p className="mb-6 text-lg text-muted-foreground">Have access to the largest african market at your fingertips</p>
      <label className="block mb-2 text-base font-medium">Email address</label>
      <div className="mb-6 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📧</span>
        <Input type="email" placeholder="Email address" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <Button className="w-full mb-4" onClick={() => onSignIn(email)}>Sign in</Button>
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-muted-foreground/30" />
        <span className="mx-2 text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-muted-foreground/30" />
      </div>
      <Button variant="outline" className="w-full mb-6 flex items-center justify-center gap-2" onClick={onGoogleSignIn}>
        <span className="text-xl">🌐</span> Sign in with Google
      </Button>
      <div className="text-center text-base">Already have an account? <span className="text-primary font-semibold cursor-pointer" onClick={onSignInLink}>Sign in</span></div>
    </Card>
  );
} 
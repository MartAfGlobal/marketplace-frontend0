import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PasswordUpdatedPopup({ onBackToLogin }: { onBackToLogin: () => void; }) {
  return (
    <Card className="w-full max-w-md p-8 mx-auto text-center">
      <div className="flex justify-center mb-4">
        <span className="bg-green-500 rounded-full p-4"><span className="text-white text-4xl">✔️</span></span>
      </div>
      <h2 className="text-3xl font-bold mb-2">Password updated</h2>
      <p className="mb-6 text-lg text-muted-foreground">You can login using your new password</p>
      <Button className="w-full" onClick={onBackToLogin}>Back to login</Button>
    </Card>
  );
} 
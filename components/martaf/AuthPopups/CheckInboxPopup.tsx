"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

interface CheckInboxPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function CheckInboxPopup({ open, onOpenChange, onBack }: CheckInboxPopupProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">
              Check Your Inbox
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Email Sent!</h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent you an email with instructions to complete your registration. 
            Please check your inbox and follow the link to verify your account.
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full h-12 bg-[#FF715B] text-white rounded-lg font-medium hover:bg-[#ff4d2d]"
              onClick={() => window.open('mailto:', '_blank')}
            >
              Open Email App
            </Button>
            
            <Button 
              variant="outline"
              className="w-full h-12 rounded-lg border-gray-200"
              onClick={onBack}
            >
              Back to Sign Up
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 
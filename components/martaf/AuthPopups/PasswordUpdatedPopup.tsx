"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface PasswordUpdatedPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function PasswordUpdatedPopup({ open, onOpenChange, onBack }: PasswordUpdatedPopupProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto max-h-[95vh] overflow-hidden">
        <DrawerHeader className="border-b p-4 flex-shrink-0">
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
              Password Updated
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Password Updated Successfully!</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>

          <Button 
            className="w-full h-12 bg-[#FF715B] text-white rounded-lg font-medium hover:bg-[#ff4d2d]"
            onClick={onBack}
          >
            Continue to Sign In
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 
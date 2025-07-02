// components/ConfirmDeliveryModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmDeliveryModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (orderId: string | number | null) => void;
  orderId?: string | number | null; // Optional orderId if needed for confirmation
}

export function ConfirmDeliveryModal({ open, onClose, onConfirm, orderId }: ConfirmDeliveryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-sm p-6 sm:p-8 w-[30%]">
        <div className="flex justify-between items-start">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-lg sm:text-xl font-semibold">
              Did you receive this package?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-black ">
              Confirming helps us complete your order and improve service.
            </DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            {/* <button
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button> */}
          </DialogClose>
        </div>

        <div className="flex gap-3 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
            >
              No
            </Button>
          </DialogClose>
          <Button
            className="flex-1 bg-[#FF715B] hover:bg-[#ff4d2d] text-white"
            onClick={() => {
              if (orderId !== undefined) {
                onConfirm(orderId);
              }
              onClose(); // close after confirming
            }}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import XIcon from "@/assets/icons/X.svg";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";

interface ConfirmItemArrivalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  orderId: string;
  logisticsCompany: string;
  trackingNumber: string;
}

export default function ConfirmItemArrivalModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  orderId,
  logisticsCompany,
  trackingNumber,
}: ConfirmItemArrivalModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-[426px] shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <Image src={XIcon} alt="close" width={20} height={20} />
        </button>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-c18 font-MontserratMedium text-000000 leading-[26px]">
              Confirm item arrival
            </h2>
            <p className="text-xs text-000000/68 font-MontserratNormal leading-[16px]">
              Verify the item has arrived at the hub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Order ID</Label>
              <Input
                type="text"
                value={orderId || "N/A"}
                disabled
                className="bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label>Logistics company</Label>
              <Input
                type="text"
                value={logisticsCompany || "N/A"}
                disabled
                icon={<ChevronDown className="w-5 h-5 text-000000/68 pointer-events-none" />}
                className="bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label>Order tracking number</Label>
              <Input
                type="text"
                value={trackingNumber || "N/A"}
                disabled
                className="bg-transparent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? <LoadingSpinner /> : "Confirm"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

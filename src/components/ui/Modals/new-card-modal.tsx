"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import { AddCardModalProps, CardDetails } from "@/types/global";

export default function AddCardModal({ isOpen, onClose, onSave }: AddCardModalProps) {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(cardDetails);
    onClose();
    setCardDetails({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-125 w-full h-fit max-h-115.5 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h2 className="font-MontserratSemiBold text-c16 mb-c32">Add a New Card</h2>

            <div className="flex flex-col gap-6 font-MontserratSemiBold text-c12 text-000000/60">
              <div className="flex flex-col gap-2 w-full">
                <Label>Card Number</Label>
                <Input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleChange("cardNumber", e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label>Cardholder Name</Label>
                <Input
                  type="text"
                  value={cardDetails.cardName}
                  onChange={(e) => handleChange("cardName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="flex gap-6 w-full">
                <div className="flex flex-col gap-2 w-1/2">
                  <Label>MM/YY</Label>
                  <Input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => handleChange("expiry", e.target.value)}
                    placeholder="MM/YY"
                  />
                </div>

                <div className="flex flex-col gap-2 w-1/2 ">
                  <Label>CVV</Label>
                  <Input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => handleChange("cvv", e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end  mt-8 font-MontserratSemiBold text-sm">
              <Button onClick={handleSave} className="bg-ff715b w-full max-w-41.5 text-white">
                Save Card
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, ChevronDown } from "lucide-react";
import { Input } from "../../forms/Input";
import { Label } from "../../forms/Label";

interface ApproveBuyerDeliveryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (data: any) => void;
  onReject: () => void;
  loading?: boolean;
}

export default function ApproveBuyerDeliveryAddressModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  loading,
}: ApproveBuyerDeliveryAddressModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto"
        >
          <div className="min-h-full py-10 px-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-xl flex flex-col w-full max-w-[800px] rounded-2xl p-8 md:p-12 relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8 max-w-lg mx-auto">
                <h2 className="text-xl font-MontserratSemiBold mb-3 text-[#161616]">
                  Approve Buyer Delivery Address
                </h2>
                <p className="text-sm font-MontserratMedium text-gray-600">
                  You are about to approve the buyer delivery details. Once approved, the delivery address of this order is changed.
                </p>
              </div>

              <div className="flex justify-end mb-8">
                <div className="flex items-center gap-3">
                  <Label className="whitespace-nowrap font-MontserratSemiBold">Admin:</Label>
                  <Input 
                    type="text" 
                    readOnly 
                    value="Auto-filled Admin Name - Super Admin" 
                    className="w-64 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Buyer's Name:</Label>
                  <Input type="text" readOnly value="auto-filled (not editable)" className="bg-white" />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Email Address:</Label>
                  <Input type="email" readOnly value="auto-filled (not editable)" className="bg-white" />
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Phone Number</Label>
                  <Input type="text" readOnly value="auto-filled (not editable)" className="bg-white" />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Original Delivery Address:</Label>
                  <Input type="text" readOnly value="auto-filled" className="bg-white" />
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">New Delivery Address:</Label>
                  <Input type="text" placeholder="Enter New Address" className="bg-white" />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Country</Label>
                  <div className="relative">
                    <select className="w-full h-12 px-3.5 rounded-c8 border border-efefef text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none focus:border-ff715b focus:ring-1 focus:ring-ff715b appearance-none">
                      <option>auto - filled</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">State</Label>
                  <div className="relative">
                    <select className="w-full h-12 px-3.5 rounded-c8 border border-efefef text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none focus:border-ff715b focus:ring-1 focus:ring-ff715b appearance-none">
                      <option>auto - filled</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">City</Label>
                  <div className="relative">
                    <select className="w-full h-12 px-3.5 rounded-c8 border border-efefef text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none focus:border-ff715b focus:ring-1 focus:ring-ff715b appearance-none">
                      <option>auto - filled</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Postal Code</Label>
                  <Input type="text" placeholder="auto - filled" className="bg-white" />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Reason for Edit</Label>
                  <Input type="text" placeholder="auto - filled" className="bg-white" />
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Action Performed by:</Label>
                  <Input type="text" readOnly value="auto-filled with Admin's name (Role)" className="bg-white" />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Date & Time</Label>
                  <div className="relative">
                    <Input type="text" readOnly value="12/12/2025 (auto-filled)" className="bg-white" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-800 font-MontserratMedium">
                      12:25 pm
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Admin Note:</Label>
                  <textarea 
                    readOnly
                    value="Auto-filled note (if provided by junior admin staff)."
                    className="w-full h-24 p-3.5 rounded-c8 border border-efefef text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Buyer Notification (Read-only)</Label>
                  <textarea 
                    readOnly
                    value="Your delivery address was updated and approved. Please complete the revised shipping payment by {date} to continue your order delivery."
                    className="w-full h-24 p-3.5 rounded-c8 border border-efefef text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">New Delivery Fee</Label>
                  <Input type="text" placeholder="Newly generated delivery fee (auto-filled)." className="bg-white" />
                </div>
                <div>
                  <Label className="mb-2 block font-MontserratSemiBold">Notes (optional)</Label>
                  <textarea 
                    placeholder="input"
                    className="w-full h-24 p-3.5 rounded-c8 border border-efefef text-sm font-MontserratMedium text-gray-700 bg-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 mb-10">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded border-[#ff715b] text-[#ff715b] focus:ring-[#ff715b] cursor-pointer"
                  />
                </div>
                <label className="text-sm font-MontserratMedium text-gray-600 cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
                  I confirm that I am updating the customer's delivery address and understand that this may affect shipping cost and delivery timeline.
                </label>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Button
                  variant="danger"
                  className="bg-[#CC0000] hover:bg-[#A30000] focus:ring-[#CC0000]"
                  onClick={onReject}
                  disabled={loading}
                >
                  Reject Update
                </Button>
                <Button
                  variant="primary"
                  className="bg-[#2e7d32] hover:bg-[#1b5e20] focus:ring-[#2e7d32]"
                  onClick={() => onApprove({})}
                  disabled={!confirmed || loading}
                >
                  {loading ? <LoadingSpinner size={24} color="border-white" /> : "Approve Update"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

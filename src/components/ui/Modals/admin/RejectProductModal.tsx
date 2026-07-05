"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X, ChevronDown } from "lucide-react";
import { Label } from "../../forms/Label";
import { Input } from "../../forms/Input";
import { Textarea } from "../../forms/auth/text-area";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";

interface RejectProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string; notes: string }) => void;
  loading?: boolean;
}

export default function RejectProductModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: RejectProductModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [understood, setUnderstood] = useState(false);

  const rejectionOptions = [
    "Inappropriate Content",
    "Violates Guidelines",
    "Poor Quality",
    "Other",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-xl flex flex-col w-full max-w-[668px] h-[662px] rounded-c16 p-12 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8 max-w-[500px] mx-auto">
                <h2 className="text-c18 font-MontserratSemiBold mb-3">
                  Reject Product
                </h2>
                <p className="text-sm font-MontserratNormal text-[#000000]/68">
                  You are about to reject this product. Rejected products are
                  permanently removed from the marketplace and cannot be reinstated.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-4">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                  <div>
                    <Label className="">Reason for Rejection</Label>
                    <div className="-mt-1">
                      <DropdownInput
                        options={rejectionOptions}
                        placeholder="Select Rejection Reason"
                        value={reason}
                        onChange={(val) => setReason(val)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="">More Information</Label>
                    <Textarea
                      readOnly
                      autoResize={false}
                      value="Lorem ipsum dolor sit amet consecuur.&#13;&#10;Et id in non arcu eu elit facilisi ut tell."
                      className="w-full resize-none scrollbar-hide !py-3 px-4 text-c12 font-MontserratMedium text-[#000000]/68 mt-1"
                      style={{ height: '80px' }}
                    />
                  </div>
                  <div>
                    <Label className="">Seller's Instruction</Label>
                    <Textarea
                      readOnly
                      autoResize={false}
                      value="Lorem ipsum dolor sit amet consecuur.&#13;&#10;Et id in non arcu eu elit facilisi ut tell."
                      className="w-full resize-none scrollbar-hide !py-3 px-4 text-c12 font-MontserratMedium text-[#000000]/68 mt-1"
                      style={{ height: '80px' }}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                  <div>
                    <Label className="">Action Performed by:</Label>
                    <Input
                      type="text"
                      readOnly
                      value="auto-filled with Admin's name (Role)"
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-c12 font-MontserratMedium text-[#000000]/68 bg-white focus:outline-none mt-1"
                    />
                  </div>
                  <div>
                    <Label className="">Seller Notification (Read-only)</Label>
                    <Textarea
                      readOnly
                      autoResize={false}
                      value="Your product has been rejected because it does not meet our platform requirements."
                      className="w-full resize-none scrollbar-hide !py-3 px-4 text-c12 font-MontserratMedium text-[#000000]/68 mt-1"
                      style={{ height: '80px' }}
                    />
                  </div>
                  <div>
                    <Label className="">Notes (optional)</Label>
                    <Textarea
                      value={notes}
                      autoResize={false}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="input"
                      className="w-full resize-none scrollbar-hide !py-3 px-4 text-c12 font-MontserratMedium text-[#000000]/68 mt-1"
                      style={{ height: '80px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-12">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer ${
                    understood
                      ? "bg-[#ff715b] border-[#ff715b]"
                      : "border-[#ff715b]"
                  }`}
                  onClick={() => setUnderstood(!understood)}
                >
                  {understood && (
                    <div className="w-2 h-2 bg-white rounded-sm" />
                  )}
                </div>
                <Label
                  className="cursor-pointer"
                  onClick={() => setUnderstood(!understood)}
                >
                  I understand this action is permanent and cannot be undone
                </Label>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  variant="secondary"
                  className=""
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onConfirm({ reason, notes })}
                  disabled={loading || !understood || !reason}
                  className="disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : "Reject Product"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

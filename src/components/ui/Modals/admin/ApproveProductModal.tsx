"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X } from "lucide-react";
import { Label } from "../../forms/Label";
import { Input } from "../../forms/Input";
import { Textarea } from "../../forms/auth/text-area";

interface ApproveProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  loading?: boolean;
  isFlagged?: boolean;
  isRejected?: boolean;
  adminName?: string;
}

export default function ApproveProductModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  isFlagged = false,
  isRejected = false,
  adminName = "Admin User",
}: ApproveProductModalProps) {
  const [notes, setNotes] = useState("");
  const [understood, setUnderstood] = useState(false);

  const currentDateStr = useMemo(() => new Date().toLocaleDateString("en-GB"), []);
  const currentTimeStr = useMemo(
    () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    []
  );

  const modalTitle = isFlagged
    ? "Resolve Flagged Product"
    : isRejected
    ? "Re-Approve Product"
    : "Approve Product";

  const modalDescription = isFlagged
    ? "You are about to resolve this flagged product back to Live. This clears the flagged state and reactivates the listing."
    : isRejected
    ? "You are about to re-approve a previously rejected product. Note: Re-approving a rejected product requires Super Admin privileges."
    : "You are about to approve this product. Once approved, the product will be visible to buyers and available for purchase.";

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
              className="bg-white shadow-xl flex flex-col w-full max-w-[668px] rounded-2xl p-12 relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-500 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8 max-w-124.75 mx-auto">
                <h2 className="text-c18 font-MontserratSemiBold mb-3">
                  {modalTitle}
                </h2>
                <p className="text-sm font-MontserratNormal text-000000/68">
                  {modalDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-4">
                <div>
                  <Label className="">
                    Action Performed by:
                  </Label>
                  <Input
                    type="text" 
                    readOnly 
                    value={adminName} 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-MontserratMedium text-gray-500 bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <Label className="">
                    Date & Time
                  </Label>
                  <div className="relative">
                    <Input
                      type="text" 
                      readOnly 
                      value={currentDateStr} 
                      className="w-full h-12 px-4 rounded-xl border border-gray-200 text-sm font-MontserratMedium text-gray-500 bg-white focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-MontserratMedium">
                      {currentTimeStr}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-6">
                <div>
                  <Label className="">
                    Seller Notification (Read-only)
                  </Label>
                  <Textarea
                    readOnly 
                    autoResize={false}
                    value={
                      isFlagged
                        ? "Your product flag has been cleared and your listing is reactivated."
                        : "Your product has been reviewed and approved. It is now live on the platform."
                    } 
                    className="w-full resize-none scrollbar-hide !py-1.5 text-c12 font-MontserratMedium text-000000/68"
                    style={{ height: '72px' }}
                  />
                </div>
                <div>
                  <Label className="flex items-center justify-between">
                    <span>Notes (optional)</span>
                    <span className="text-[10px] text-gray-400 font-normal">Internal only</span>
                  </Label>
                  <Textarea
                    value={notes}
                    autoResize={false}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal moderation notes (moderation_admin_notes, never shown to seller)"
                    className="w-full resize-none scrollbar-hide !py-1.5 text-c12 font-MontserratMedium"
                    style={{ height: '72px' }}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Notes are stored in moderation_admin_notes and never visible to the seller.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div 
                  className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer ${understood ? 'bg-[#ff715b] border-[#ff715b]' : 'border-[#ff715b]'}`}
                  onClick={() => setUnderstood(!understood)}
                >
                  {understood && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <Label 
                  className="cursor-pointer"
                  onClick={() => setUnderstood(!understood)}
                >
                  {isFlagged
                    ? "I understand this product flag will be cleared and reactivated."
                    : "I understand this product will be visible to buyers once approved."}
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
                  onClick={() => onConfirm(notes)}
                  disabled={loading || !understood}
                  className="disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner /> : modalTitle}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


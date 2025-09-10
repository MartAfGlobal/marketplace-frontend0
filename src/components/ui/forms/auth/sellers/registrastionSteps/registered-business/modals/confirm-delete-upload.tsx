"use client";


import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Close from "@/assets/icons/close.png";

export default function ConfirmModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
 
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
       
        onClick={onCancel}
      >
        <motion.div
          className="bg-white rounded-c24 deleteModal-shadow px-c40 py-c48 w-full max-w-150 h-95.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={(e) => e.stopPropagation()} 
        >
          <div className="flex justify-between items-center pb-5 border-b-4 border-b-f5f5f5 mb-16 ">
            <p className="text-c32 text-161616 font-MontserratSemiBold">Confirm Delete File</p>
            <button
              className="h-fit w-fit flex-shrink-0"
              onClick={onCancel} 
            >
              <Image src={Close} alt="closeModal" width={14.73} height={19.16} />
            </button>
          </div>

          <p className="text-c18 font-MontserratSemiBold text-161616 text-center mb-15">Are you sure that you want to delete this file?</p>


          <div className="flex gap-6 items-center justify-center text-c18 font-MontserratSemiBold">
            <button
              className="w-full max-w-40 h-14 border border-000000/30 rounded-lg text-000000/30"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="w-full max-w-62.75 h-14 bg-ca0202 text-white rounded-lg"
              onClick={onConfirm}
            >
              Yes, Confirm Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

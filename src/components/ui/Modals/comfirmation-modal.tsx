"use client";
import { motion, AnimatePresence } from "framer-motion";

import React from "react";
import { ConfirmModalProps } from "@/types/global";
import { Button } from "../Button/Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  description,
  onYes,
  onNo,
  yesText = "Yes",
  noText = "No",
  className = "",
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`bg-white rounded-2xl h-fit max-h-49 shadow-lg w-full  max-w-106.5 p-8 relative ${className}`}
          >
          
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-c16 font-MontserratSemiBold mb-2 text-000000">
              {title}
            </h2>

            <p className="text-c12 font-MontserratMedium text-000000 mb-6">
              {description}
            </p>

            <div className="w-full flex gap-4 font-MontserratSemiBold text-sm  justify-center">
              <Button
                onClick={() => {
                  onNo();
                  onClose();
                }}
                className=" bg-transparent text-ff715b border border-ff715b hover:text-ffffff"
              >
                {noText}
              </Button>
              <Button
                onClick={() => {
                  onYes();
                  onClose();
                }}
                className=""
              >
                {yesText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

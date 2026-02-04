"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../Button/Button";

type ResultModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  result?: "warning" | "error" | "success" | "failed";
  title?: string;
  message?: string;
  buttenText?: string;
  discRescription?: string;
};

export default function ResultModal({
  isOpen,
  onConfirm,
  result = "success",
  title,
  message,
  buttenText,
  discRescription,
}: ResultModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-c16 deleteModal-shadow relative overflow-hidden w-full max-w-93.5 h-fit"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* SUCCESS HEADER */}
            {result === "success" && (
              <div className="h-38.25 w-full bg-2d7565 overflow-hidden flex items-center justify-center">
                <motion.div
                  className="w-[279.22px] h-[279.22px] rounded-full border-50 border-[#4DBEA7] flex items-center justify-center"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <div className="w-16.25 h-16.25 rounded-full border-ffffff border-5 flex items-center justify-center">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                      className="w-14 h-14"
                    >
                      <motion.path
                        d="M14 27 L22 35 L38 17"
                        fill="transparent"
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </motion.svg>
                  </div>
                </motion.div>
              </div>
            )}

            {/* CONTENT */}
            <div className="w-full py-c32 px-6">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-c18 font-MontserratMedium text-161616">
                  {title}
                </h1>
                <p className="text-base font-MontserratMedium text-000000">
                  {message}
                </p>
                {discRescription && (
                  <p className="text-sm text-000000/70">
                    {discRescription}
                  </p>
                )}
              </div>

              <div className="flex justify-center mt-c24">
                <Button onClick={onConfirm}>
                  {buttenText || "Okay"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

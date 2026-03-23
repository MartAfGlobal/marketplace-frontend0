"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../Button/Button";
import Image from "next/image";
import Xicon from "@/assets/icons/X.svg";
import { LoadingSpinner } from "../loading-spinner";

type ResultModalProps = {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  result?: "warning" | "error" | "success" | "failed";
  title?: string;
  message?: string;
  buttenText?: string;
  discRescription?: string;
  loading?: boolean;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
};

export default function ResultModal({
  isOpen,
  onConfirm,
  onCancel,
  result = "success",
  title,
  message,
  buttenText,
  discRescription,
  loading,
  secondaryButtonText,
  onSecondaryAction,
}: ResultModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const config = {
    success: {
      bg: "bg-#FFAC06",
      border: "#FFAC06",
      icon: (
        <motion.path
          d="M14 27 L22 35 L38 17"
          fill="transparent"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      ),
    },

    warning: {
      bg: "bg-[#F59E0B]",
      border: "#FCD34D",
      icon: (
        <>
          {/* Triangle */}
          <motion.path
            d="M26 6 L46 42 H6 Z"
            fill="transparent"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Exclamation line */}
          <motion.line
            x1="26"
            y1="18"
            x2="26"
            y2="30"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          />

          {/* Exclamation dot */}
          <motion.circle
            cx="26"
            cy="36"
            r="2"
            fill="#FFFFFF"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          />
        </>
      ),
    },
    error: {
      bg: "bg-[#DC2626]",
      border: "#FCA5A5",
      icon: (
        <>
          <motion.line
            x1="16"
            y1="16"
            x2="36"
            y2="36"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7 }}
          />
          <motion.line
            x1="36"
            y1="16"
            x2="16"
            y2="36"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
        </>
      ),
    },
  };

  const active = config[result === "failed" ? "error" : result];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-c16 deleteModal-shadow relative overflow-hidden w-full max-w-81 h-fit px-10 md:px-0"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div
              className={`h-38.25 w-full ${active.bg} relative flex items-center justify-center overflow-hidden`}
            >
              <button className="h-6 w-6 absolute z-50 right-4 top-13.25" onClick={onCancel}>
                <Image
                  src={Xicon}
                  alt="X"
                  height={24}
                  width={24}
                  className=" "
                />
              </button>
              <motion.div
                className="w-[279.22px] h-[279.22px] rounded-full border-50 flex items-center justify-center "
                style={{ borderColor: active.border }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                {result === "success" ? (
                  <div className="w-16.25 h-16.25 rounded-full border-white border-5 flex items-center justify-center">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 52 52"
                      className="w-14 h-14"
                    >
                      {active.icon}
                    </motion.svg>
                  </div>
                ) : (
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    className="w-14 h-14"
                  >
                    {active.icon}
                  </motion.svg>
                )}
              </motion.div>
            </div>

            {/* CONTENT */}
            <div className="w-full py-c32 px-6">
              <div className="flex flex-col gap-2 text-center">
                {title && (
                  <h1 className="text-c18 font-MontserratMedium text-161616">
                    {title}
                  </h1>
                )}

                {message && (
                  <p className="text-base font-MontserratMedium text-000000">
                    {message}
                  </p>
                )}

                {discRescription && (
                  <p className="text-sm text-000000/70">{discRescription}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-center gap-2 mt-c24 ">
                {onCancel && result === "warning" && (
                  <Button variant="primary" onClick={onCancel}>
                    Cancel
                  </Button>
                )}

                {onSecondaryAction && secondaryButtonText && (
                  <Button variant="secondary" onClick={onSecondaryAction} disabled={loading}>
                    {secondaryButtonText}
                  </Button>
                )}

                {onConfirm && (
                  <Button
                    variant="primary"
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner color="border-ff715b" /> : buttenText || "Okay"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

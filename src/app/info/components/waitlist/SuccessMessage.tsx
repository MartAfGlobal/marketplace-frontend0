"use client";

import React from "react";
import { motion } from "framer-motion";

interface SuccessMessageProps {
  onClose: () => void;
}

export default function SuccessMessage({ onClose }: SuccessMessageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 bg-6a0dad/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
        <div className="w-16 h-16 bg-6a0dad rounded-full flex items-center justify-center shadow-lg shadow-6a0dad/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h3 className="text-3xl font-MontserratBold text-161616 mb-4">You're in!</h3>
      <p className="text-gray-400 font-MontserratMedium text-lg leading-relaxed max-w-sm mx-auto mb-10">
        We've added you to the exclusive Martaf waitlist. Keep an eye on your inbox for something special.
      </p>
      <button
        onClick={onClose}
        className="px-12 py-4 bg-6a0dad text-white rounded-full font-MontserratBold shadow-xl shadow-6a0dad/20 hover:scale-105 transition-all active:scale-95"
      >
        Close Window
      </button>
    </motion.div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../Button/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestCheckout: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onGuestCheckout,
}: CheckoutModalProps) {
  const router = useRouter();

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleLogin = () => {
    if (isMobile) {
      // Go to landing page and tell it to open login modal
      router.replace("/?showLogin=true");
    } else {
      // Desktop → go to dedicated login page
      router.replace("/auth/login");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >    <div className="fixed inset-0 flex items-end md:items-center justify-center md:p-4 px-4 z-[9999]">
           <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className=" bg-white shadow-xl flex flex-col items-center gap-8 w-full max-w-101.5 rounded-t-2xl md:rounded-xl p-6 md:p-8 max-h-120 overflow-y-auto"
                
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full justify-between flex items-center">
              <h2 className="text-base font-MontserratSemiBold text-gray-800">
                Continue to Checkout
              </h2>
              <button
                onClick={onClose}
                className=" text-gray-500 hover:text-gray-800 text-lg"
              >
                ✕
              </button>
            </div>
            <p className="text-sm mb-6 font-MontserratNormal">
              Would you like to buy as a guest or login to your account?
            </p>
            <div className="flex w-full gap-3">
              <Button
                className="w-full  "
                variant="secondary"
                onClick={() => {
                  if (isMobile) {
                    router.push("/cart/checkout/guest-checkout");
                  } else {
                    onGuestCheckout();
                  }
                }}
              >
                Buy as Guest
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  handleLogin(); // login flow
                }}
              >
                Login
              </Button>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

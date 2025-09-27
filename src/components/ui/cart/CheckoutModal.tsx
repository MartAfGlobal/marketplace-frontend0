"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../Button/Button";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-MontserratSemiBold mb-4">
              Continue to Checkout
            </h2>
            <p className="text-sm mb-6">
              Would you like to buy as a guest or login to your account?
            </p>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full  "
                variant="secondary"
                onClick={() => {
                  onClose();
                  router.push("/payment-gateway"); // guest flow
                }}
              >
                Buy as Guest
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  router.push("/login"); // login flow
                }}
              >
                Login to Continue
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

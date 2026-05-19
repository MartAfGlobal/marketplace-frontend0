"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import EyeIcon from "@/assets/icons/eye.png";
import EyeOffIcon from "@/assets/icons/eyeOff.png";
import Image from "next/image";
import { LoadingSpinner } from "../loading-spinner";

interface Confirm2faPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  loading?: boolean;
  isEnabled: boolean; // currently enabled
}

export default function Confirm2faPasswordModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  isEnabled,
}: Confirm2faPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShowPassword(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    onConfirm(password);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white p-6 md:p-8 rounded-2xl max-w-101.5 w-full h-fit relative shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg disabled:opacity-50"
            >
              ✕
            </button>

            <h2 className="font-MontserratSemiBold text-c16 mb-4 text-[#333333]">
              {isEnabled ? "Disable 2FA" : "Enable 2FA"}
            </h2>

            <p className="text-c12 font-MontserratMedium text-000000/60 mb-6">
              {isEnabled
                ? "Please enter your password to disable Two-Factor Authentication."
                : "Please enter your password to enable Two-Factor Authentication."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 relative w-full">
                <Label className="text-c12 font-MontserratMedium text-[#333333]">
                  Password
                </Label>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="******"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Image
                      src={showPassword ? EyeIcon.src : EyeOffIcon.src}
                      alt={showPassword ? "Hide" : "Show"}
                      width={18.75}
                      height={15.01}
                      className="opacity-45"
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex gap-4 mt-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={loading}
                  onClick={onClose}
                  className="w-full max-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full max-w-[120px] bg-ff715b text-white flex justify-center items-center"
                >
                  {loading ? <LoadingSpinner /> : "Confirm"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import EyeIcon from "@/assets/icons/eye.png"; // open eye
import EyeOffIcon from "@/assets/icons/eyeOff.png"; // closed eye
import { ResetPasswordModalProps } from "@/types/global";
import Image from "next/image";
import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";

import { validatePassword } from "@/utils/passwordValidation";

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onSave,
  loading = false, // added support for loading state from parent
}: ResetPasswordModalProps & { loading?: boolean }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [submitted, setSubmitted] = useState(false);
  const passValidation = validatePassword(passwords.newPassword);

  const handleSave = () => {
    setSubmitted(true);

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!passValidation.isValid) {
      toast.error(passValidation.errorMessage || "New password does not meet security requirements.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (onSave) {
      onSave(passwords);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
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
            className="bg-white p-8 rounded-2xl max-w-101.5 w-full h-fit max-h-[90vh] overflow-y-auto relative"
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
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h2 className="font-MontserratSemiBold text-c16 mb-c32">
              Reset Password
            </h2>

            <div className="flex flex-col gap-c24 text-000000/72 text-left">
              {(
                ["currentPassword", "newPassword", "confirmPassword"] as const
              ).map((field) => (
                <div
                  key={field}
                  className="flex flex-col gap-2 relative w-full"
                >
                  <Label className="text-c12 font-MontserratMedium">
                    {field === "currentPassword"
                      ? "Current Password"
                      : field === "newPassword"
                      ? "New Password"
                      : "Confirm Password"}
                  </Label>
                  <div className="relative w-full">
                    <Input
                      type={showPassword[field] ? "text" : "password"}
                      value={passwords[field]}
                      placeholder="******"
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Image
                        src={showPassword[field] ? EyeIcon.src  : EyeOffIcon.src}
                        alt={showPassword[field] ? "Hide" : "Show"}
                        width={18.75}
                        height={15.01}
                        className="opacity-45"
                      />
                    </button>
                  </div>
                  {field === "newPassword" && (submitted || passwords.newPassword.length > 0) && !passValidation.isValid && (
                    <p className="text-c12 text-red-500 font-MontserratMedium mt-1">
                      {passValidation.errorMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="w-full flex justify-end mt-c32">
              <Button
              disabled={loading}
                onClick={handleSave}
                className="w-full max-w-50.5 bg-ff715b text-white flex justify-center items-center"
              >
                {loading? <LoadingSpinner/>:"Save Password"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

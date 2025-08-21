"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import Eye from "@/assets/icons/eye.png"; // your eye icon
import EyeOff from "@/assets/icons/eyeOff.png"; 
import CloseX from "@/assets/mobile/closeX.png"; // your close icon

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });



useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden"; // disable scroll
  } else {
    document.body.style.overflow = "auto"; // enable scroll
  }
}, [isOpen]);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEye = (field: "current" | "new" | "confirm") => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // optional, if you want clicking outside to close
            className="fixed inset-0 w-full h-screen bg-black z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-80 px-3.75"
          >
            <div className="bg-white rounded-t-c16  py-6 px-c32 shadow-lg">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-c32">
                <h2 className="font-MontserratSemiBold text-c16 text-161616">
                  Change Password
                </h2>
                <button
                  onClick={onClose}
                 
                >
                  <Image src={CloseX} alt="close" width={15.1} height={15.1} />
                </button>
              </div>

      
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
                    Current Password
                  </label>
                  <div className="flex items-center border h-c48 border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
                  
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                 
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full outline-none"
                    />

                      <button
                      type="button"
                      onClick={() => toggleEye("current")}
                     
                    >
                      <Image
                        src={showPassword.current ? Eye : EyeOff}
                        alt="toggle password"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
                    New Password
                  </label>
                  <div className="flex items-center h-c48 border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
                  
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                   
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full outline-none"
                    />
                      <button
                      type="button"
                      onClick={() => toggleEye("new")}
                    
                    >
                      <Image
                        src={showPassword.new ? Eye : EyeOff}
                        alt="toggle password"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
                    Confirm Password
                  </label>
                  <div className="flex h-c48 items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
                  
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                     
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full outline-none"
                    />
                      <button
                      type="button"
                      onClick={() => toggleEye("confirm")}
                 
                    >
                      <Image
                        src={showPassword.confirm ? Eye : EyeOff}
                        alt="toggle password"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 py-c32 text-c12 font-MontserratSemiBold">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg border border-ff715b text-ff715b"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 rounded-lg bg-ff715b text-white"
                >
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

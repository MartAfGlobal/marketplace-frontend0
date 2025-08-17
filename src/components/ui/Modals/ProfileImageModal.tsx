"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import UploadIcon from "@/assets/icons/user-dashboard/uploadIcon.svg";
import { Button } from "@/components/ui/Button/Button";

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StaticImageData | string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function ProfileImageModal({
  isOpen,
  onClose,
  currentProfile,
  onUpload,
  onRemove,
}: ProfileImageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  }

  return (
  <AnimatePresence>
  {isOpen && (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center w-full h-full justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      onClick={onClose} // close when clicking outside
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="bg-white p-9 rounded-lg w-80 h-fit relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { duration: 0.8, ease: "easeOut" },
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Profile Preview */}
        <div className="flex justify-center ">
          {currentProfile && (
            <Image
              src={currentProfile}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex flex-col gap-4 mt-c32">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-ff715b text-white  flex items-center mt-0 h-68.25  justify-center gap-3"
          >
            <Image src={UploadIcon} alt="upload" width={24} height={24} />
            Upload from device
          </Button>

          <Button
            onClick={onRemove}
            className="bg-transparent border border-ff715b text-ff715b mt-0 h-68.25  rounded "
          >
            No profile picture
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  );
}

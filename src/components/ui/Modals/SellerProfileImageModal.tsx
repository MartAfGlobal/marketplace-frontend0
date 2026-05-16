"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import UploadIcon from "@/assets/icons/user-dashboard/uploadIcon.svg";
import { Button } from "@/components/ui/Button/Button";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import profileImage from "@/assets/icons/profile-averter.svg"; 
import ResultModal from "@/components/ui/forms/resultModal";

import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";
import { sellerActions } from "@/store/user-data/seller/seller-slice";

interface SellerProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StaticImageData | string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function SellerProfileImageModal({
  isOpen,
  onClose,
  currentProfile,
  onUpload,
  onRemove,
}: SellerProfileImageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();

  const { loading, sendHttpRequest: updateProfileReq } = useHttp();

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    const form = new FormData();
    form.append("profile_picture", selectedFile);

    const successRes = (res: any) => {
      if (selectedFile) {
        const profileURL = URL.createObjectURL(selectedFile);
        
        if (sellerData) {
          dispatch(
            sellerActions.updateSellerData({
              profile: {
                ...sellerData.profile,
                profile_picture_url: profileURL,
              },
            } as any)
          );
        }
        onUpload(selectedFile);
      }
      setShowSuccessModal(true);
    };

    updateProfileReq({
      successRes,
      requestConfig: {
        url: "/accounts/manufacturer/profile-update/",
        method: "PATCH",
        body: form,
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
    });
  };

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
      setSelectedFile(file);
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {showSuccessModal && (
        <ResultModal
          key="success-result-modal"
          isOpen={showSuccessModal}
          onCancel={handleCloseSuccess}
          onConfirm={handleCloseSuccess}
          buttenText="Close"
          result="success"
          title="Success!"
          message="Profile picture updated successfully."
        />
      )}
      {isOpen && !showSuccessModal && (
        <motion.div
          key="profile-image-modal"
          className="fixed inset-0 bg-black/50 flex items-center w-full h-full justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
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
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* Profile Preview */}
            <div className="flex justify-center h-26 w-26 m-auto">
              {(selectedFile || currentProfile || profileImage) && (
                <Image
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : (currentProfile || profileImage)
                  }
                  alt="Profile"
                  width={104}
                  height={104}
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
            <div className="flex flex-col gap-4 mt-6">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-ff715b text-white flex items-center justify-center gap-3"
              >
                <Image src={UploadIcon} alt="upload" width={24} height={24} />
                Upload from device
              </Button>

              <Button
                onClick={onRemove}
                variant="secondary"
              >
                No profile picture
              </Button>

              <Button
                onClick={handleEditSubmit}
                disabled={loading}
              >
                {loading ? <LoadingSpinner/> : "Save"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";


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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const buyer = useSelector((state: any) => state.buyer.BuyerData);
  const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();




  const router = useRouter();

  const { loading, sendHttpRequest: editRegisterUserReq } = useHttp();

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }
    

    const form = new FormData();
    form.append("profile_picture", selectedFile);

   const registerUserRes = (res: any) => {
  toast.success("Profile picture updated successfully!");
   
  if (selectedFile) {
    const profileURL = URL.createObjectURL(selectedFile);

    dispatch(
      buyerActions.updateBuyerData({
        profile: {
          ...buyer.profile,
          profile_picture: profileURL,
        },
      })
    );

   
    onUpload(selectedFile!);
  }

  onUpload(selectedFile!);  // ✅ 
  onClose();
  router.push(`/dashboard/buyer`);
};

    editRegisterUserReq({
      successRes: registerUserRes,
      requestConfig: {
        url: "/accounts/UserDetails/",
        method: "PATCH",
        body: form, 
        token: token ?? undefined,
        isAuth: true,
        userType: "buyer",
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


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
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
              {(selectedFile || buyer?.profile?.profile_picture || profileImage) && (
                <Image
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : (currentProfile as string)
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
                className=""
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

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiService } from "@/lib/api";
import { User as AppUser } from "@/types/api";
import Image from "next/image";
import { CloudUpload } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: AppUser) => void;
  initialProfilePicture?: string;
}

export function UpdateProfilePictureModal({
  open,
  onClose,
  onProfileUpdated,
  initialProfilePicture,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialProfilePicture || null
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile));

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    setLoading(true);
    try {
      const updatedUser = await apiService.updateUserProfile(formData);
      toast.success("Profile picture updated");
      onProfileUpdated(updatedUser);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePicture = async () => {
    setFile(null);
    setPreviewImage(null);

    const formData = new FormData();
    formData.append("profile_picture", ""); // You can also omit this field depending on backend

    setLoading(true);
    try {
      const updatedUser = await apiService.updateUserProfile(formData);
      toast.success("Profile picture removed");
      onProfileUpdated(updatedUser);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    setLoading(true);
    try {
      const updatedUser = await apiService.updateUserProfile(formData);
      toast.success("Profile picture updated");
      onProfileUpdated(updatedUser);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-[30%] p-6 sm:p-8 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold flex justify-center rounded-full">
            <div className="rounded-full">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile Preview"
                  width={200}
                  height={200}
                  className="rounded-full object-cover border-2 border-gray-300 hover:opacity-80 transition"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-xl text-white bg-gradient-to-br from-purple-500 to-pink-500">
                  ?
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-6 w-[80%] justify-center m-auto">
          <label
            htmlFor="profile-upload"
            className="bg-[#FF715B] rounded-sm py-3 flex items-center justify-center gap-4 text-md text-white font-medium transition-opacity cursor-pointer"
          >
            <CloudUpload />
            upload from device
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <div className="mt-2 flex-1 border border-[#FF715B] rounded-sm">
            <Button
              variant="outline"
              className="w-full text-gray-700 h-11"
              onClick={handleRemovePicture}
              disabled={loading}
            >
              No Profile Picture
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

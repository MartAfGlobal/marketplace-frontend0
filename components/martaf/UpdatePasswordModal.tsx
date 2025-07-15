// components/UpdatePasswordModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, X } from "lucide-react";
import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => void;
}

export function UpdatePasswordModal({ open, onClose, onSubmit }: Props) {
  const [formData, setFormData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    onSubmit(
      formData.currentPassword,
      formData.newPassword,
      formData.confirmPassword
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-sm p-6 sm:p-8 w-[30%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update password
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 mb-18">
          {["currentPassword", "newPassword", "confirmPassword"].map(
            (field) => {
              const label =
                field === "currentPassword"
                  ? "Current password"
                  : field === "newPassword"
                  ? "New password"
                  : "Confirm password";

              return (
                <div className="relative" key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {label}
                  </label>
                  <input
                    id={field}
                    type={
                      showPassword[field as keyof typeof showPassword]
                        ? "text"
                        : "password"
                    }
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full border rounded px-3 py-2 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() =>
                      toggleShow(field as keyof typeof showPassword)
                    }
                  >
                    {showPassword[field as keyof typeof showPassword] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            }
          )}
        </div>

        <div className="mb-10 absolute left-54 bottom-0">
          <Button
            className="w-full bg-[#FF715B] hover:bg-[#ff4d2d] text-white"
            onClick={handleSubmit}
          >
            Update password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

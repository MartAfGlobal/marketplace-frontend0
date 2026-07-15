"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { Input } from "../../forms/Input";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { Label } from "../../forms/Label";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading?: boolean;
  initialData?: any;
}

export default function EditAccountModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialData = {},
}: EditAccountModalProps) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    dob: initialData.dob || "",
    gender: initialData.gender || "",
  });

  // Re-sync when open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        dob: initialData.dob || "",
        gender: initialData.gender || "",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const genderOptions = ["Male", "Female", "Other"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow-xl flex flex-col w-full max-w-[517px] rounded-2xl p-8 overflow-visible"
            >
              <div className="text-center mb-6">
                <h2 className="text-lg font-MontserratSemiBold text-[#000000] mb-1">
                  Account information
                </h2>
                <p className="text-xs font-MontserratMedium text-[#666666]">
                  Update details of buyers account information
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8 overflow-visible">
                {/* Row 1: First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-MontserratMedium text-[#666666] mb-1">
                      First Name
                    </Label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-MontserratMedium text-[#666666] mb-1">
                      Last Name
                    </Label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                {/* Row 2: DOB & Gender */}
                <div className="grid grid-cols-2 gap-4 overflow-visible">
                  {/* DOB using customized calendar component */}
                  <div className="overflow-visible">
                    <Label className="block text-xs font-MontserratMedium text-[#666666] mb-1">
                      Date of birth
                    </Label>
                    <Input
                      name="dob"
                      type="date-custom"
                      value={formData.dob}
                      onChange={handleChange}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>

                  {/* Gender Option */}
                  <div>
                    <Label className="block ">
                      Gender
                    </Label>
                    <DropdownInput
                      placeholder="Gender"
                      options={genderOptions}
                      value={
                        formData.gender
                          ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1).toLowerCase()
                          : ""
                      }
                      onChange={(val) => setFormData({ ...formData, gender: val })}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-transparent text-[#FF715B] border border-[#FF715B] hover:bg-[#FFE8E8] h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onConfirm(formData)}
                  disabled={loading}
                  className="flex-1 bg-[#FF715B] text-white hover:bg-[#e56550] h-12 border-none"
                >
                  {loading ? <LoadingSpinner /> : "Update details"}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

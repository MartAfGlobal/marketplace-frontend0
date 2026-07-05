"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../Button/Button";
import { LoadingSpinner } from "../../loading-spinner";
import { Input } from "../../forms/Input";
import { Label } from "../../forms/Label";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading?: boolean;
  initialData?: any;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialData = {},
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    address: initialData.address || "",
    state: initialData.state || "",
    country: initialData.country || "",
    zipcode: initialData.zipcode || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              className="bg-white shadow-xl flex flex-col w-full max-w-[517px] rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-lg font-MontserratSemiBold text-[#000000] mb-1">
                  Address information
                </h2>
                <p className="text-xs font-MontserratMedium text-[#666666]">
                  Update details of buyers address information
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <Label className="">
                    Address
                  </Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-MontserratMedium text-[#666666] mb-1">
                      State
                    </Label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-MontserratMedium text-[#666666] mb-1">
                      Country
                    </Label>
                    <Input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label className="block text-xs font-MontserratMedium text-[#666666] mb-1">
                    Zipcode
                  </Label>
                  <Input
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    placeholder="Zipcode"
                    className="h-11 rounded-xl w-1/2 pr-2"
                  />
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { X } from "lucide-react";

interface AttributeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribute: {
    name: string;
    isActive: boolean;
    dateCreated: string;
    lastUpdated: string;
    values: string[];
  } | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: (val: boolean) => void;
}

export default function AttributeDetailsModal({
  isOpen,
  onClose,
  attribute,
  onEdit,
  onDelete,
  onToggleActive,
}: AttributeDetailsModalProps) {
  const [isActive, setIsActive] = useState(attribute?.isActive ?? true);

  if (!attribute) return null;

  const handleToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    if (onToggleActive) {
      onToggleActive(newState);
    }
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
              className="bg-white shadow-xl flex flex-col w-full max-w-150 rounded-[16px] p-12 relative"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[#343330] hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-c18 font-MontserratSemiBold mb-8 text-center ">
                Attribute Details
              </h2>

              <div className="space-y-8">
                {/* Name & Active Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="font-MontserratSemiBold text-lg ">Attribute Name</span>
                    <span className={`px-4 py-1.5 h-8 rounded-c16 text-c12 font-MontserratSemiBold ${isActive ? 'bg-[#28A745]/12  text-[#28A745]' : 'bg-red-50 text-red-600'}`}>
                      {isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-MontserratSemiBold text-base text-black">Hide</span>
                    <button 
                      onClick={handleToggle}
                      className={`w-11.5 h-6 rounded-full flex items-center p-0.5 transition-colors ${!isActive ? 'bg-gray-300' : 'bg-gray-100'}`}
                    >
                      <motion.div 
                        animate={{ x: !isActive ? 24 : 0 }} 
                        className="w-5 h-5 bg-white rounded-full shadow-[0px_3px_8px_0px_#6A0DAD14]"
                      />
                    </button>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex border border-000000/12 rounded-xl overflow-hidden">
                  <div className="flex-1 px-4 py-3 border-r border-r-000000/12 ">
                    <p className="text-sm font-MontserratSemiBold mb-4">Date Created</p>
                    <p className="text-sx font-MontserratNormal">12/12/2025</p>
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <p className="text-sm font-MontserratSemiBold mb-4">Last Updated</p>
                    <p className="text-sx font-MontserratNormal">12/12/2025</p>
                  </div>
                </div>

                {/* Values List */}
                <div>
                  <div className="mb-6">
                    <span className="text-sm font-MontserratSemiBold leading-[20px]">Attribute Values </span>
                    <span className="text-sm font-MontserratSemiBold leading-[20px] text-000000/68">({attribute.values.length})</span>
                  </div>
                  <div className="grid grid-col-4 lg:grid-cols-5  gap-6 max-h-[144px]  overflow-y-auto no-scrollbar ">
                    {attribute.values.map((val, idx) => (
                      <div key={idx} className="h-8 bg-947fff/10 truncate rounded-c8 w-20 flex items-center justify-center text-c12 font-MontserratMedium">
                        {val}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-6  mt-12 justify-end">
                  <Button 
                  variant="secondary"
                    className="max-w-40 "
                    onClick={onEdit}
                  >
                    Edit Attribute
                  </Button>
                  <Button 
                    className="max-w-40 bg-ca0202"
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

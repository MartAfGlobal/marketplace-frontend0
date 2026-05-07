"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

// Role Images
import SellerImg from "@/assets/images/info/seller.png";
import BuyerImg from "@/assets/images/info/buyer.png";
import InvestorImg from "@/assets/images/info/investor.png";

// Components
import SellerForm from "./components/waitlist/SellerForm";
import BuyerForm from "./components/waitlist/BuyerForm";
import InvestorForm from "./components/waitlist/InvestorForm";
import SuccessMessage from "./components/waitlist/SuccessMessage";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = ["Seller", "Buyer", "Investor"] as const;

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [selectedType, setSelectedType] = useState<"Seller" | "Buyer" | "Investor">("Seller");
  const [isSuccess, setIsSuccess] = useState(false);

  const roleDetails = {
    Seller: {
      image: SellerImg,
      title: "Global Marketplace",
      desc: "Connect your African brand to the global diaspora and beyond."
    },
    Buyer: {
      image: BuyerImg,
      title: "Authentic Goods",
      desc: "Direct access to verified African makers and unique treasures."
    },
    Investor: {
      image: InvestorImg,
      title: "Trade Innovation",
      desc: "Support high-growth brands scaling across international borders."
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedType("Seller");
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-[1100px] p-0 overflow-hidden border-none bg-white rounded-[40px] shadow-[0_32px_80px_rgba(106,13,173,0.12)]">
        <div className="relative flex flex-col lg:flex-row h-full max-h-[95vh] lg:h-[700px]">
          {/* Close Button */}
          <button 
            onClick={resetAndClose}
            className="absolute top-8 right-8 z-50 p-2.5 bg-white/10 backdrop-blur-xl lg:bg-fafafa hover:bg-efefef rounded-full transition-all duration-300 group"
          >
            <X size={18} className="text-gray-400 group-hover:text-6a0dad" />
          </button>

          {/* Left Visual Section (Desktop) */}
          <div className="hidden lg:block w-[42%] relative overflow-hidden bg-6a0dad">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image 
                  src={roleDetails[selectedType].image} 
                  alt={selectedType}
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-6a0dad via-6a0dad/40 to-transparent" />
                
                <div className="absolute bottom-16 left-12 right-12 text-white">
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-MontserratBold uppercase tracking-[0.2em] mb-4"
                  >
                    {selectedType} Program
                  </motion.span>
                  <motion.h3 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-MontserratBold text-4xl mb-4 leading-tight"
                  >
                    {roleDetails[selectedType].title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/80 text-lg font-MontserratMedium leading-relaxed max-w-sm"
                  >
                    {roleDetails[selectedType].desc}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Form Section */}
          <div className="flex-1 flex flex-col min-w-0 bg-white relative">
            <div className="flex-1 overflow-y-auto custom-scroll p-10 md:p-14">
              <DialogHeader className="p-0 text-left mb-12">
                <DialogTitle className="text-3xl md:text-4xl font-MontserratBold text-161616 mb-4 tracking-tight">
                  {isSuccess ? "You're on the list!" : "Step into the Future"}
                </DialogTitle>
                <p className="text-gray-400 font-MontserratMedium">
                  Join Martaf's exclusive waitlist and be the first to know when we launch globally.
                </p>
                
                {!isSuccess && (
                  <div className="mt-10 flex p-1.5 bg-fafafa rounded-2xl border border-efefef w-fit">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedType(tab)}
                        className={`px-8 py-3 rounded-xl font-MontserratBold text-xs uppercase tracking-wider transition-all duration-300 ${
                          selectedType === tab
                            ? "bg-white text-6a0dad shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-efefef"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
              </DialogHeader>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <SuccessMessage key="success" onClose={resetAndClose} />
                  ) : (
                    <motion.div 
                      key={selectedType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                    >
                      {selectedType === "Seller" && (
                        <SellerForm onSuccess={() => setIsSuccess(true)} />
                      )}
                      {selectedType === "Buyer" && (
                        <BuyerForm onSuccess={() => setIsSuccess(true)} />
                      )}
                      {selectedType === "Investor" && (
                        <InvestorForm onSuccess={() => setIsSuccess(true)} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

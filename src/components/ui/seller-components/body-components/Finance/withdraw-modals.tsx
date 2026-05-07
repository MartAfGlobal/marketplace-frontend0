"use client";

import React, { useState } from "react";
import { X, ChevronDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/Provider";

interface WithdrawModalsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawModals({ isOpen, onClose }: WithdrawModalsProps) {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: Success
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("Access Bank - 078****43456");

  const { balance: financeBalance } = useAppSelector((state) => state.finance);
  const availableBalance = financeBalance?.balance || 0;
  const availableBalanceNum = typeof availableBalance === "string" ? parseFloat(availableBalance) : availableBalance;

  const handleNext = () => setStep(step + 1);
  const handleReset = () => {
    setStep(1);
    onClose();
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return `N${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-md bg-white rounded-[24px] p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-MontserratBold text-[#161616]">Withdraw funds</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-[#666666]" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-MontserratBold text-[#999999] uppercase tracking-wider">Select Bank</label>
                <div className="relative">
                  <button className="w-full h-12 px-4 bg-[#f8f9fa] border border-[#e5e5e5] rounded-xl flex items-center justify-between text-[11px] font-MontserratMedium text-[#161616]">
                    <span>{selectedBank}</span>
                    <ChevronDown size={16} className="text-[#999999]" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-MontserratBold text-[#999999] uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-MontserratBold text-[#161616]">N</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-12 pl-8 pr-4 bg-white border border-[#e5e5e5] rounded-xl text-[11px] font-MontserratBold text-[#161616] outline-none focus:border-[#ff6b6b] transition-colors"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#999999] font-MontserratMedium">Available: {formatCurrency(availableBalance)}</span>
                  <button onClick={() => setAmount(availableBalanceNum.toString())} className="text-[10px] text-[#ff6b6b] font-MontserratBold hover:underline">Max</button>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!amount || parseFloat(amount) > availableBalanceNum}
                className="w-full h-12 bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-xl text-sm font-MontserratBold shadow-lg shadow-[#ff6b6b]/20 mt-4"
              >
                Withdraw Funds
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-sm bg-white rounded-[24px] p-8 shadow-2xl text-center"
          >
            <div className="flex justify-end absolute top-6 right-6">
               <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-[#666666]" />
              </button>
            </div>

            <div className="mb-8 pt-4">
              <h2 className="text-lg font-MontserratBold text-[#161616] mb-2">Confirm OTP</h2>
              <p className="text-[11px] text-[#999999] font-MontserratMedium leading-relaxed">
                Enter the 4-digit code sent to<br />
                <span className="text-[#161616] font-MontserratSemiBold">alex***@gmail.com</span>
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength={1}
                  className="w-12 h-14 border border-[#e5e5e5] rounded-xl text-center text-xl font-MontserratBold outline-none focus:border-[#ff6b6b] transition-all"
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              className="w-full h-12 bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-xl text-sm font-MontserratBold shadow-lg shadow-[#ff6b6b]/20 mb-4"
            >
              Confirm Withdrawal
            </Button>
            
            <button className="text-[10px] text-[#999999] font-MontserratMedium hover:text-[#161616] transition-colors">
              Didn't receive code? <span className="text-[#ff6b6b] font-MontserratBold hover:underline">Resend</span>
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white rounded-[24px] p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Celebration background element */}
            <div className="absolute top-0 left-0 w-full h-32 bg-green-500/10 -z-10" />
            
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                 <CheckCircle2 size={48} className="text-green-500" />
              </div>
            </div>

            <h2 className="text-xl font-MontserratBold text-[#161616] mb-2">Withdrawal Successful</h2>
            <p className="text-[11px] text-[#999999] font-MontserratMedium mb-8">Your funds have been dispatched to your bank.</p>

            <div className="bg-[#f8f9fa] border border-[#f0f0f0] rounded-2xl p-5 space-y-4 mb-8 text-left">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-MontserratMedium text-[#999999]">Amount</span>
                  <span className="text-[11px] font-MontserratBold text-[#161616]">N{amount}.00</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-MontserratMedium text-[#999999]">Bank</span>
                  <span className="text-[11px] font-MontserratBold text-[#161616]">Access Bank</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-MontserratMedium text-[#999999]">Account</span>
                  <span className="text-[11px] font-MontserratBold text-[#161616]">078****43456</span>
               </div>
            </div>

            <Button 
                onClick={handleReset}
                className="w-full h-12 bg-[#ff6b6b] hover:bg-[#ff5252] text-white rounded-xl text-sm font-MontserratBold shadow-lg shadow-[#ff6b6b]/20"
            >
                Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

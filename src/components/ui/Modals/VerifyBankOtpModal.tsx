"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { X, CheckCircle2 } from "lucide-react";
import { LoadingSpinner } from "../loading-spinner";

interface VerifyBankOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onBack?: () => void;
  bankDetails: {
    bank_name: string;
    account_number: string;
  } | null;
}

export default function VerifyBankOtpModal({ isOpen, onClose, onSuccess, onBack, bankDetails }: VerifyBankOtpModalProps) {
  const [step, setStep] = useState(2); // 2: OTP, 3: Success
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  
  const token = useSelector((state: RootState) => state.token.token);
  const { loading: verifying, sendHttpRequest: verifyReq } = useHttp();
  const { loading: submitting, sendHttpRequest: submitReq } = useHttp();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(2);
      setTimer(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, timer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = () => {
    if (!canResend || !bankDetails) return;
    
    submitReq({
      requestConfig: {
        url: "/accounts/manufacturer/bank/add/",
        method: "POST",
        body: {
          bank_name: bankDetails.bank_name,
          account_number: bankDetails.account_number,
        },
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setTimer(300);
        setCanResend(false);
        toast.success("OTP resent successfully");
      },
      errorRes: (err: any) => {
        toast.error(err?.message || "Failed to resend OTP");
      }
    });
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    verifyReq({
      requestConfig: {
        url: "/accounts/manufacturer/bank/add/verify-otp/", 
        method: "POST",
        body: {
          otp: otpValue,
          bank_name: bankDetails?.bank_name,
          account_number: bankDetails?.account_number
        },
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: () => {
        setStep(3);
        toast.success("Bank account verified successfully!");
      },
      errorRes: (err: any) => {
        toast.error(err?.message || "OTP verification failed");
      }
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`bank-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`bank-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-[492px]  py-8 px-c48 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.3 } }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#666666] hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            <AnimatePresence mode="wait">
              {step === 2 && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-center mb-8 w-full">
                    <h2 className="text-c18 font-MontserratMedium mb-3">Enter OTP</h2>
                    <p className="text-c12  font-MontserratMedium leading-4 w-full mx-auto tracking-[0.01em]">
                      We've sent a 6-digit code to your email. Enter it below to continue.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 mb-8">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`bank-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-[56px] h-[64px] border border-[#e5e5e5] rounded-xl text-center text-[20px] font-MontserratBold outline-none focus:border-[#ff6b6b] transition-all bg-white"
                      />
                    ))}
                  </div>

                  <div className="flex gap-4 w-full">
                    <button
                      onClick={handleResendOtp}
                      disabled={!canResend || submitting}
                      className={`flex-1 h-12 rounded-xl border border-[#ff6b6b] text-[#ff6b6b] font-MontserratSemiBold text-[14px] transition-colors ${(!canResend || submitting) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fff5f5]"}`}
                    >
                      {submitting ? <LoadingSpinner size={16} color="border-[#ff6b6b]" /> : `Resend OTP (${formatTimer(timer)})`}
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={verifying}
                      className="flex-1 h-12 rounded-xl bg-[#ff6b6b] text-white font-MontserratSemiBold text-[14px] hover:bg-[#e55a5a] transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {verifying ? <LoadingSpinner size={20} /> : "Verify"}
                    </button>
                  </div>

                  {/* {onBack && (
                    <button 
                      onClick={onBack}
                      className="mt-6 text-[13px] text-[#ff6b6b] font-MontserratMedium hover:underline"
                    >
                      Back to details
                    </button>
                  )} */}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-xl font-MontserratBold text-[#161616] mb-2">Successful!</h2>
                  <p className="text-[12px] text-[#999999] font-MontserratMedium mb-8">
                    Your bank account has been successfully linked.
                  </p>
                  <button
                    onClick={() => {
                      if (onSuccess) onSuccess();
                      onClose();
                    }}
                    className="w-full h-12 rounded-xl bg-[#ff6b6b] text-white font-MontserratSemiBold text-[14px] hover:bg-[#e55a5a] transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

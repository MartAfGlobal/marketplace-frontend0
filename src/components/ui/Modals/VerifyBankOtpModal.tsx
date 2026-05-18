"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { X, ChevronDown } from "lucide-react";
import { LoadingSpinner } from "../loading-spinner";
import { SellerMobileHeader } from "../seller-components/header-components/SellerMobileHeader";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import ResultModal from "../forms/resultModal";

interface VerifyBankOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  bankDetails?: {
    bank_name: string;
    account_number: string;
  } | null;
  onBack?: () => void;
}

const VerifyBankOtpModal = ({
  isOpen,
  onClose,
  onSuccess,
  bankDetails,
  onBack,
}: VerifyBankOtpModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(2); // Start from OTP step

  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    let interval: any;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`bank-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`bank-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifying(true);
    sendHttpRequest({
      requestConfig: {
        url: "/accounts/manufacturer/bank/add/verify-otp/",
        method: "POST",
        token: token ?? "",
        isAuth: true,
        userType: "seller",
        body: {
          otp: otpString,
          is_default: true,
        },
      },
      successRes: () => {
        setVerifying(false);
        setStep(3); // Show success
      },
      errorRes: (err: any) => {
        setVerifying(false);
        toast.error(err?.message || "Invalid OTP");
      }
    });
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setSubmitting(true);
    sendHttpRequest({
      requestConfig: {
        url: "/accounts/manufacturer/bank/add/",
        method: "POST",
        token: token ?? "",
        isAuth: true,
        userType: "seller",
        body: {
          bank_code: "resend", // Adjust based on API
          account_number: bankDetails?.account_number,
        },
      },
      successRes: () => {
        setSubmitting(false);
        setTimer(60);
        setCanResend(false);
        toast.success("New OTP sent successfully");
      },
      errorRes: (err: any) => {
        setSubmitting(false);
        toast.error(err?.message || "Failed to resend OTP");
      }
    });
  };

  const formatTimer = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[50] md:z-[100] md:flex md:items-center md:justify-center pt-18 md:pt-0"
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-[#F9F9FB] md:bg-black/50" 
              onClick={onClose} 
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full h-full md:h-auto md:max-w-[426px] flex flex-col bg-white md:bg-white md:rounded-2xl md:shadow-xl"
            >
              {/* Mobile Header (Same component used in other pages) */}
              <div className="md:hidden py-6">
                <SellerMobileHeader 
                  title="Back" 
                  onBack={onBack || onClose} 
                  showBorder={false}
                />
              </div>

              {/* Desktop Close Button */}
              <button
                onClick={onClose}
                className="hidden md:block absolute top-6 right-6 text-[#666666] hover:text-black transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="flex-1 overflow-y-auto pb-10 md:p-8">
                <div className="bg-white p-6 md:p-0">
                  <div className="flex flex-col items-center">
                    <div className="text-center mb-10 w-full">
                      <h2 className="text-c18 font-MontserratMedium">Enter OTP</h2>
                      <p className="text-000000/44 text-c12 font-MontserratMedium">
                        We've sent a 6-digit code to your email. Enter it below to continue.
                      </p>
                    </div>

                    <div className="flex justify-center mb-10 gap-3 w-full">
                      {otp.map((digit, idx) => (
                        <Input
                          key={idx}
                          id={`bank-otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-full  h-13.5 md:h-12 text-center text-xl font-MontserratBold px-0"
                        />
                      ))}
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={verifying || otp.some(d => d === "")}
                      >
                        {verifying ? <LoadingSpinner /> : "Verify"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleResendOtp}
                        disabled={!canResend || submitting}
                      >
                        {submitting ? <LoadingSpinner  color="border-ff715b" /> : `Resend OTP (${formatTimer(timer)})`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResultModal
        isOpen={isOpen && step === 3}
        result="success"
        title="Success!"
        message="Your bank account has been successfully linked."
        buttenText="Done"
        onConfirm={() => {
          if (onSuccess) onSuccess();
          onClose();
          setStep(2);
        }}
        onCancel={() => {
          if (onSuccess) onSuccess();
          onClose();
          setStep(2);
        }}
      />
    </>
  );
};

export default VerifyBankOtpModal;

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

function extractRetryAfter(data: any): number | null {
  const raw =
    data?.retry_after ??
    data?.retry_after_seconds ??
    data?.resend_after ??
    data?.cooldown ??
    data?.wait_seconds ??
    data?.expires_in ??
    null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const DEFAULT_BANK_OTP_TIMEOUT = 60;

const VerifyBankOtpModal = ({
  isOpen,
  onClose,
  onSuccess,
  bankDetails,
  onBack,
}: VerifyBankOtpModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(DEFAULT_BANK_OTP_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(2); // Start from OTP step

  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest } = useHttp();

  // Clipboard paste suggestion
  const [clipboardOtp, setClipboardOtp] = useState<string | null>(null);
  const lastCheckedClip = useRef<string>("");

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, 6);
      if (numeric.length === 6 && numeric !== lastCheckedClip.current) {
        lastCheckedClip.current = numeric;
        setClipboardOtp(numeric);
      } else if (numeric.length !== 6) {
        setClipboardOtp(null);
      }
    } catch {
      // Silent fail if permission not granted
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkClipboard();
      window.addEventListener("focus", checkClipboard);
      return () => window.removeEventListener("focus", checkClipboard);
    }
  }, [isOpen, checkClipboard]);

  const applyClipboardOtp = () => {
    if (!clipboardOtp) return;
    const nextOtp = Array(6).fill("");
    clipboardOtp.split("").forEach((ch, i) => { nextOtp[i] = ch; });
    setOtp(nextOtp);
    setClipboardOtp(null);
    lastCheckedClip.current = "";
    document.getElementById(`bank-otp-${Math.min(clipboardOtp.length - 1, 5)}`)?.focus();
  };

  const handleDirectPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, 6);
      if (numeric.length > 0) {
        const nextOtp = Array(6).fill("");
        numeric.split("").forEach((ch, i) => { nextOtp[i] = ch; });
        setOtp(nextOtp);
        setClipboardOtp(null);
        lastCheckedClip.current = "";
        document.getElementById(`bank-otp-${Math.min(numeric.length - 1, 5)}`)?.focus();
        toast.success("Code pasted from clipboard");
      } else {
        toast.error("No code found in clipboard");
      }
    } catch {
      toast.error("Clipboard access denied. Please paste into the box.");
    }
  };

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
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 6 || (cleaned.length > 1 && !otp[index])) {
      const nextOtp = [...otp];
      const pasted = (cleaned.length > 6 ? cleaned.slice(-6) : cleaned).slice(0, 6);
      pasted.split("").forEach((ch, i) => {
        nextOtp[i] = ch;
      });
      setOtp(nextOtp);
      const focusIndex = Math.min(pasted.length - 1, 5);
      document.getElementById(`bank-otp-${focusIndex}`)?.focus();
      return;
    }

    const digit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
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

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const nextOtp = Array(6).fill("");
    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    document.getElementById(`bank-otp-${Math.min(pasted.length - 1, 5)}`)?.focus();
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
      successRes: (res: any) => {
        setSubmitting(false);
        const backendRetry =
          extractRetryAfter(res?.data) ??
          extractRetryAfter(res) ??
          DEFAULT_BANK_OTP_TIMEOUT;
        setTimer(backendRetry);
        setCanResend(false);
        toast.success("New OTP sent successfully");
      },
      errorRes: (err: any) => {
        setSubmitting(false);
        const backendRetry = extractRetryAfter(err?.response?.data);
        if (backendRetry) {
          setTimer(backendRetry);
          setCanResend(false);
        }
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
            className="fixed inset-0 z-[110] md:z-[120] md:flex md:items-center md:justify-center pt-18 md:pt-0"
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

                    {/* Clipboard paste suggestion banner */}
                    {clipboardOtp && (
                      <div className="flex items-center gap-2 w-full px-3 py-2 mb-4 rounded-lg bg-ff715b/10 border border-ff715b/30 animate-in fade-in slide-in-from-top-2 duration-200">
                        <svg className="w-4 h-4 text-ff715b shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="flex-1 text-c12 font-MontserratMedium text-161616">
                          OTP code copied — paste it?
                        </span>
                        <button
                          type="button"
                          onClick={applyClipboardOtp}
                          className="text-c12 font-MontserratSemiBold text-ff715b hover:underline shrink-0"
                        >
                          Paste OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => { setClipboardOtp(null); lastCheckedClip.current = ""; }}
                          aria-label="Dismiss"
                          className="text-161616/40 hover:text-161616 transition-colors ml-1 shrink-0"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-2 mb-10 w-full">
                      <div className="flex justify-center gap-3 w-full">
                        {otp.map((digit, idx) => (
                          <Input
                            key={idx}
                            id={`bank-otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            autoComplete={idx === 0 ? "one-time-code" : "off"}
                            maxLength={6}
                            value={digit}
                            onFocus={() => {
                              checkClipboard();
                            }}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={handleOtpPaste}
                            className="w-full h-13.5 md:h-12 text-center text-xl font-MontserratBold px-0"
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleDirectPaste}
                        className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-MontserratMedium text-ff715b hover:text-ff715b/80 transition-colors py-1 px-2.5 rounded-full hover:bg-ff715b/5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Paste code from clipboard
                      </button>
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

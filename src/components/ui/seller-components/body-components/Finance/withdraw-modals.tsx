"use client";

import React, { useState, useEffect, useRef, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import Image from "next/image";
import { X, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import { Label } from "@/components/ui/forms/Label";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/Provider";
import { useFetchProducts } from "@/helpers/sellers/fetchProducts";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import CaretDown from "@/assets/Seller/caretDown.png";
import AddNewAccountModal from "@/components/ui/Modals/AddNewAccountModal";
import VerifyBankOtpModal from "@/components/ui/Modals/VerifyBankOtpModal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface WithdrawModalsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface BankAccount {
  id: string | number;
  bank_name: string;
  account_number: string;
  account_name?: string;
  is_default?: boolean;
  [key: string]: any;
}

const MINIMUM_WITHDRAWAL = 50000;

// Preset buttons reflecting the >= 50,000 requirement
const selectAmount = [
  { label: "N50,000", value: "50000" },
  { label: "N100,000", value: "100000" },
  { label: "N250,000", value: "250000" },
];

const OTP_LENGTH = 6;
const DEFAULT_RESEND_TIMEOUT = 120;

export default function WithdrawModals({
  isOpen,
  onClose,
}: WithdrawModalsProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: OTP, 3: Success
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

  // Bank accounts
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [banksLoading, setBanksLoading] = useState(false);
  const bankDropdownRef = useRef<HTMLDivElement | null>(null);

  // Add Bank Modal state
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isVerifyBankOtpModalOpen, setIsVerifyBankOtpModalOpen] = useState(false);
  const [newlyAddedBankDetails, setNewlyAddedBankDetails] = useState<{
    bank_name: string;
    account_number: string;
  } | null>(null);

  // OTP step state
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(DEFAULT_RESEND_TIMEOUT);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const token = useAppSelector((state) => state.token?.token);
  const sellerEmail = useAppSelector((state) => state.seller?.data?.email);
  const { wallet_balance : financeBalance } = useAppSelector((state) => state.finance);
  const { fetchBanks, fetchBalance, fetchTransactions } = useFetchProducts();

  const { loading: initiateLoading, sendHttpRequest: sendInitiateRequest } = useHttp();
  const { loading: confirmLoading, sendHttpRequest: sendConfirmRequest } = useHttp();
  const { loading: resendLoading, sendHttpRequest: sendResendRequest } = useHttp();

  const availableBalance = financeBalance?.wallet_balance || 0;
  const availableBalanceNum =
    typeof availableBalance === "string"
      ? parseFloat(availableBalance)
      : Number(availableBalance || 0);

  // Load banks on open
  useEffect(() => {
    if (isOpen && token) {
      setBanksLoading(true);
      fetchBanks((fetchedBanks) => {
        setBanks(fetchedBanks);
        if (fetchedBanks.length > 0) {
          const defaultBank = fetchedBanks.find((b: BankAccount) => b.is_default) || fetchedBanks[0];
          setSelectedBank(defaultBank);
        }
        setBanksLoading(false);
      });
    }
  }, [isOpen, token]);

  const handleAddBankSuccess = (details: { bank_name: string; account_number: string }) => {
    setNewlyAddedBankDetails(details);
    setIsAddAccountModalOpen(false);
    setIsVerifyBankOtpModalOpen(true);
  };

  const handleVerifyBankSuccess = () => {
    setIsVerifyBankOtpModalOpen(false);
    setBanksLoading(true);
    fetchBanks((fetchedBanks) => {
      setBanks(fetchedBanks);
      if (fetchedBanks.length > 0) {
        const newlyAdded = fetchedBanks.find(
          (b: BankAccount) => b.account_number === newlyAddedBankDetails?.account_number
        );
        setSelectedBank(newlyAdded || fetchedBanks[0]);
      }
      setBanksLoading(false);
    });
  };

  // Click outside to close bank dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBankDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // OTP timer countdown
  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  // Auto-focus first digit on entering Step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  const handleReset = () => {
    setStep(1);
    setAmount("");
    setReason("");
    setSelectedAmount(null);
    setDigits(Array(OTP_LENGTH).fill(""));
    setTimer(DEFAULT_RESEND_TIMEOUT);
    onClose();
  };

  const formatCurrency = (val: string | number) => {
    const num = typeof val === "string" ? parseFloat(val) : Number(val);
    if (isNaN(num)) return "N0.00";
    return `N${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const maskAccount = (num?: string) => {
    if (!num) return "";
    if (num.length <= 4) return num;
    return `${num.slice(0, 3)}****${num.slice(-3)}`;
  };

  // Step 1: Initiate withdrawal
  const handleInitiate = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (!numericAmount || isNaN(numericAmount)) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (numericAmount < MINIMUM_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is ₦${MINIMUM_WITHDRAWAL.toLocaleString()}.`);
      return;
    }

    if (numericAmount > availableBalanceNum) {
      toast.error("Withdrawal amount exceeds available wallet balance.");
      return;
    }

    if (!selectedBank?.id) {
      toast.error("Please select a valid bank account.");
      return;
    }

    sendInitiateRequest({
      requestConfig: {
        url: "/commission/manufacturer/wallet/withdrawals/initiate/",
        method: "POST",
        token: token || undefined,
        isAuth: true,
        userType: "seller",
        body: {
          amount: numericAmount.toFixed(2),
          bank_detail: selectedBank.id,
          reason: reason.trim() || "Withdrawal",
        },
      },
      successRes: (res: any) => {
        toast.success(res?.data?.detail || res?.data?.message || "OTP sent successfully.");
        setTimer(DEFAULT_RESEND_TIMEOUT);
        setDigits(Array(OTP_LENGTH).fill(""));
        setStep(2);
      },
      errorRes: (err: any) => {
        const errorDetail =
          err?.response?.data?.detail ||
          err?.response?.data?.amount?.[0] ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to initiate withdrawal.";
        toast.error(errorDetail);
      },
    });
  };

  // Step 2: OTP input handlers & clipboard paste suggestion
  const [clipboardOtp, setClipboardOtp] = useState<string | null>(null);
  const lastCheckedClip = useRef<string>("");

  const checkClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (numeric.length === OTP_LENGTH && numeric !== lastCheckedClip.current) {
        lastCheckedClip.current = numeric;
        setClipboardOtp(numeric);
      } else if (numeric.length !== OTP_LENGTH) {
        setClipboardOtp(null);
      }
    } catch {
      // Silent fail if permission not granted
    }
  }, []);

  useEffect(() => {
    if (step === 2) {
      checkClipboard();
      window.addEventListener("focus", checkClipboard);
      return () => window.removeEventListener("focus", checkClipboard);
    }
  }, [step, checkClipboard]);

  const applyClipboardOtp = () => {
    if (!clipboardOtp) return;
    const next = Array(OTP_LENGTH).fill("");
    clipboardOtp.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    setClipboardOtp(null);
    lastCheckedClip.current = "";
    const focusIndex = Math.min(clipboardOtp.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleDirectPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const numeric = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (numeric.length > 0) {
        const next = Array(OTP_LENGTH).fill("");
        numeric.split("").forEach((ch, i) => { next[i] = ch; });
        setDigits(next);
        setClipboardOtp(null);
        lastCheckedClip.current = "";
        const focusIndex = Math.min(numeric.length, OTP_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
        toast.success("Code pasted from clipboard");
      } else {
        toast.error("No code found in clipboard");
      }
    } catch {
      toast.error("Clipboard access denied. Please paste into the box.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= OTP_LENGTH || (cleaned.length > 1 && !digits[index])) {
      const next = [...digits];
      const pasted = (cleaned.length > OTP_LENGTH ? cleaned.slice(-OTP_LENGTH) : cleaned).slice(0, OTP_LENGTH);
      pasted.split("").forEach((ch, i) => {
        next[i] = ch;
      });
      setDigits(next);
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const otp = digits.join("");
  const isOtpComplete = otp.length === OTP_LENGTH && digits.every((d) => d !== "");

  // Step 2: Confirm OTP
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    sendConfirmRequest({
      requestConfig: {
        url: "/commission/manufacturer/wallet/withdrawals/confirm/",
        method: "POST",
        token: token || undefined,
        isAuth: true,
        userType: "seller",
        body: { otp },
      },
      successRes: () => {
        toast.success("Withdrawal request confirmed successfully.");
        setStep(3);
        // Refresh balance and transactions in background
        fetchBalance();
        fetchTransactions(1);
      },
      errorRes: (err: any) => {
        const errorDetail =
          err?.response?.data?.detail ||
          err?.response?.data?.otp?.[0] ||
          err?.response?.data?.message ||
          err?.message ||
          "Invalid or expired OTP.";
        toast.error(errorDetail);
      },
    });
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    if (timer > 0 || resendLoading) return;
    if (!selectedBank?.id) return;

    const numericAmount = parseFloat(amount);
    sendResendRequest({
      requestConfig: {
        url: "/commission/manufacturer/wallet/withdrawals/initiate/",
        method: "POST",
        token: token || undefined,
        isAuth: true,
        userType: "seller",
        body: {
          amount: numericAmount.toFixed(2),
          bank_detail: selectedBank.id,
          reason: reason.trim() || "Withdrawal",
        },
      },
      successRes: () => {
        toast.success("OTP resent to your registered email.");
        setTimer(DEFAULT_RESEND_TIMEOUT);
        setDigits(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      },
      errorRes: (err: any) => {
        const errorDetail =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to resend OTP. Please try again.";
        toast.error(errorDetail);
      },
    });
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const numericAmount = parseFloat(amount);
  const isAmountValid =
    !isNaN(numericAmount) &&
    numericAmount >= MINIMUM_WITHDRAWAL &&
    numericAmount <= availableBalanceNum;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleReset}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Withdrawal Info ─────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full md:max-w-[440px] bg-white rounded-t-2xl md:rounded-[16px] p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="text-lg font-MontserratMedium text-[#161616]">Withdraw money</h2>
              <button
                onClick={handleReset}
                className="absolute top-6 right-6 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-[#343330]" />
              </button>
            </div>

            {/* Preset Amount Buttons */}
            <div className="flex items-center gap-3 mb-6">
              {selectAmount.map((item) => {
                const isSelected = selectedAmount === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(item.value);
                      setAmount(item.value);
                    }}
                    className={`flex-1 h-12 border rounded-c8 transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? "border-ff715b bg-ff715b/10 text-ff715b font-MontserratSemiBold"
                        : "border-000000/12 hover:border-ff715b hover:bg-ff715b/5 text-[#161616] font-MontserratMedium"
                    }`}
                  >
                    <span className="text-c12">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleInitiate} className="space-y-4">
              {/* Custom Bank Dropdown */}
              <div className="space-y-1.5" ref={bankDropdownRef}>
                <Label className="">
                  Select Bank
                </Label>
                <div className="relative">
                  {!banksLoading && banks.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setIsAddAccountModalOpen(true)}
                      className="flex text-c12 font-MontserratSemiBold text-ff715b bg-white border-[0.5px] border-dashed border-ff715b hover:bg-ff715b/5 items-center w-full p-3 rounded-c8 justify-center gap-2 h-12 cursor-pointer transition-all shadow-sm"
                    >
                      <Plus size={16} className="text-ff715b" />
                      <span>Add account</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsBankDropdownOpen((prev) => !prev)}
                      className="flex text-c12 font-MontserratNormal text-ff715b bg-white border-[0.5px] border-ff715b items-center w-full p-3 rounded-c8 justify-between h-12 cursor-pointer transition-colors"
                    >
                      <span className={`truncate ${selectedBank ? "text-[#161616] font-MontserratMedium" : "text-ff715b font-MontserratNormal"}`}>
                        {banksLoading
                          ? "Loading bank accounts…"
                          : selectedBank
                          ? `${selectedBank.bank_name} - ${maskAccount(selectedBank.account_number)}`
                          : "Select a bank"}
                      </span>
                      <Image
                        src={CaretDown}
                        alt="dropdown"
                        width={11}
                        height={6}
                        className={`transition-transform duration-200 ${isBankDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}

                  <AnimatePresence>
                    {isBankDropdownOpen && banks.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 left-0 mt-2 w-full py-2 px-2 text-c12 font-MontserratNormal bg-white rounded-c8 shadow-lg border border-gray-100 max-h-56 overflow-y-auto"
                      >
                        {banks.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => {
                              setSelectedBank(b);
                              setIsBankDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded cursor-pointer transition-colors flex justify-between items-center ${
                              selectedBank?.id === b.id
                                ? "bg-ff715b/10 text-ff715b font-MontserratSemiBold"
                                : "hover:bg-gray-50 text-[#161616]"
                            }`}
                          >
                            <span className="truncate">
                              {b.bank_name} - {maskAccount(b.account_number)}
                            </span>
                            {b.is_default && (
                              <span className="text-[9px] bg-ff715b/10 text-ff715b px-1.5 py-0.5 rounded font-MontserratBold uppercase">
                                Default
                              </span>
                            )}
                          </div>
                        ))}

                        <div
                          onClick={() => {
                            setIsBankDropdownOpen(false);
                            setIsAddAccountModalOpen(true);
                          }}
                          className="p-2.5 rounded cursor-pointer transition-colors flex items-center gap-2 border-t border-gray-100 text-ff715b font-MontserratMedium hover:bg-ff715b/5 mt-1"
                        >
                          <Plus size={14} className="text-ff715b" />
                          <span>Add new account</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Custom Input for Amount */}
              <div className="space-y-1.5">
                <Label className="">
                  Amount
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="50,000.00"
                    min={MINIMUM_WITHDRAWAL}
                    step="any"
                    className="pl-8"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] font-MontserratBold text-[#161616] pointer-events-none">
                    N
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-[#999999] font-MontserratMedium">
                    Available: {formatCurrency(availableBalance)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAmount(availableBalanceNum.toString());
                      setSelectedAmount(null);
                    }}
                    className="text-[10px] text-ff715b font-MontserratBold hover:underline"
                  >
                    Max
                  </button>
                </div>
                {amount && numericAmount < MINIMUM_WITHDRAWAL && (
                  <p className="text-[10px] text-red-500 font-MontserratMedium">
                    Minimum withdrawal is ₦{MINIMUM_WITHDRAWAL.toLocaleString()}.00
                  </p>
                )}
                {amount && numericAmount > availableBalanceNum && (
                  <p className="text-[10px] text-red-500 font-MontserratMedium">
                    Amount exceeds available balance.
                  </p>
                )}
              </div>

              {/* Custom TextArea for Reason */}
              <div className="space-y-1.5">
                <Label className="">
                  Description
                </Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Weekly earnings payout"
                  rows={2}
                  autoResize={true}
                  className="min-h-[116px] text-c12 font-MontserratNormal"
                />
              </div>

              {/* Custom Button for Action */}
              <Button
                type="submit"
                disabled={!isAmountValid || !selectedBank}
                loading={initiateLoading}
                color="white"
                variant="primary"
                className="mt-4"
              >
                Withdraw Funds
              </Button>
            </form>
          </motion.div>
        )}

        {/* ── STEP 2: OTP Verification ────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full md:max-w-[440px] bg-white rounded-t-2xl md:rounded-[16px] p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleReset}
              className="absolute top-6 right-6 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-[#666666]" />
            </button>

            {/* Title — matches AuthenticationLayout heading style */}
            <div className="text-center w-full max-w-100 m-auto mb-4">
              <h1 className="font-MontserratSemiBold pb-1 text-c18 text-161616">
                Enter verification code
              </h1>
              <p className="text-base font-MontserratNormal text-161616/70">
                We sent a 6-digit code to your email
              </p>
            </div>

            {/* Email hint — identical to auth OtpVerification */}
            <p className="text-center font-MontserratMedium text-c12 text-161616 mb-c32">
              Enter the 6-digit code sent to{" "}
              <span className="font-MontserratSemiBold text-ff715b break-all">
                {sellerEmail || "your registered email"}
              </span>
            </p>

            {/* Form — identical layout to auth OtpVerification */}
            <form onSubmit={handleConfirm} className="flex flex-col items-center gap-c32">
              {/* Clipboard paste suggestion banner */}
              {clipboardOtp && (
                <div className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-ff715b/10 border border-ff715b/30 animate-in fade-in slide-in-from-top-2 duration-200">
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

              {/* OTP digit boxes */}
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex gap-2 sm:gap-3 justify-center w-full">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={OTP_LENGTH}
                      value={digit}
                      onFocus={() => {
                        checkClipboard();
                      }}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      aria-label={`OTP digit ${i + 1}`}
                      className={`
                        w-10 h-12 sm:w-12 sm:h-14 text-center text-base sm:text-c18 font-MontserratSemiBold rounded-lg border-1
                        outline-none transition-all duration-200
                        ${digit
                          ? "border-ff715b  text-161616"
                          : "border-efefef bg-white text-161616"
                        }
                        focus:border-ff715b focus:ring-1 focus:ring-ff715b/20
                        caret-ff715b
                      `}
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

              {/* Submit button — full width, matches auth */}
              <Button
                type="submit"
                disabled={!isOtpComplete}
                loading={confirmLoading}
                variant="primary"
                className="w-full"
                color="ff715b"
              >
                Confirm Withdrawal
              </Button>
            </form>

            {/* Resend + Back — identical structure to auth OtpVerification */}
            <div className="flex flex-col items-center gap-2 mt-c24 font-MontserratMedium text-c12">
              <Button
                type="button"
                variant="secondary"
                onClick={handleResendOtp}
                disabled={resendLoading || timer > 0}
              >
                {resendLoading
                  ? <LoadingSpinner color="white"/>
                  : timer > 0
                  ? `Resend OTP in (${formattedTimer})`
                  : "Resend OTP"}
              </Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-161616/60 hover:text-ff715b transition-colors text-[11px]"
              >
                ← Back to edit amount
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Withdrawal Success ──────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full md:max-w-sm bg-white rounded-t-2xl md:rounded-[24px] p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-center overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-green-500/10 -z-10" />

            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
            </div>

            <h2 className="text-xl font-MontserratBold text-[#161616] mb-2">
              Withdrawal Initiated
            </h2>
            <p className="text-[11px] text-[#999999] font-MontserratMedium mb-8">
              Your withdrawal request has been submitted and is being processed.
            </p>

            <div className="bg-[#f8f9fa] border border-[#f0f0f0] rounded-2xl p-5 space-y-4 mb-8 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-MontserratMedium text-[#999999]">Amount</span>
                <span className="text-[11px] font-MontserratBold text-[#161616]">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-MontserratMedium text-[#999999]">Bank</span>
                <span className="text-[11px] font-MontserratBold text-[#161616]">
                  {selectedBank?.bank_name || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-MontserratMedium text-[#999999]">Account</span>
                <span className="text-[11px] font-MontserratBold text-[#161616]">
                  {maskAccount(selectedBank?.account_number) || "—"}
                </span>
              </div>
            </div>

            {/* Custom Button */}
            <Button
              onClick={handleReset}
              variant="primary"
            >
              Done
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Bank Account & Verification Modals */}
      <AddNewAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onSuccess={handleAddBankSuccess}
      />

      <VerifyBankOtpModal
        isOpen={isVerifyBankOtpModalOpen}
        onClose={() => setIsVerifyBankOtpModalOpen(false)}
        onSuccess={handleVerifyBankSuccess}
        bankDetails={newlyAddedBankDetails}
        onBack={() => {
          setIsVerifyBankOtpModalOpen(false);
          setIsAddAccountModalOpen(true);
        }}
      />
    </div>
  );
}

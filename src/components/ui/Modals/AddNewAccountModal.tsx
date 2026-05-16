"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { X, ChevronDown } from "lucide-react";
import { LoadingSpinner } from "../loading-spinner";

interface AddNewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bankDetails: { bank_name: string; account_number: string }) => void;
}

export default function AddNewAccountModal({ isOpen, onClose, onSuccess }: AddNewAccountModalProps) {
  const [banks, setBanks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bvn, setBvn] = useState("");
  
  const token = useSelector((state: RootState) => state.token.token);
  const { loading: fetchingBanks, sendHttpRequest: fetchBanksReq } = useHttp();
  const { loading: submitting, sendHttpRequest: submitReq } = useHttp();

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchBanks();
    } else {
      document.body.style.overflow = "";
      resetForm();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const resetForm = () => {
    setSelectedBank("");
    setSelectedBankCode("");
    setSearchQuery("");
    setShowBankDropdown(false);
    setAccountNumber("");
    setBvn("");
  };

  const fetchBanks = () => {
    fetchBanksReq({
      requestConfig: {
        url: "/accounts/banks/",
        method: "GET",
        isAuth: true,
        token: token ?? undefined,
      },
      successRes: (res: any) => {
        const bankData = res.data?.data || res.data || [];
        setBanks(Array.isArray(bankData) ? bankData : []);
      },
      errorRes: (err: any) => {
        toast.error("Failed to fetch bank list");
      }
    });
  };

  const handleAddAccount = () => {
    if (!selectedBank || !accountNumber || !bvn) {
      toast.error("Please fill in all fields");
      return;
    }
    
    submitReq({
      requestConfig: {
        url: "/accounts/manufacturer/bank/add/",
        method: "POST",
        body: {
          bank_name: selectedBank,
          account_number: accountNumber,
          bvn: bvn
        },
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        toast.success("OTP sent to your registered phone number");
        if (onSuccess) {
          onSuccess({ bank_name: selectedBank, account_number: accountNumber });
        }
      },
      errorRes: (err: any) => {
        toast.error(err?.message || "Failed to initiate bank account addition");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-[426px] p-8 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.3 } }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#666666] hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-8 ">
              <h2 className="text-c18 font-MontserratMedium text-000000 mb-2">Add new account</h2>
              <p className="text-[12px] text-000000/44 font-MontserratMedium">Securely link your bank account to receive payouts.</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5 mb-8">
              {/* Bank Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">Bank name</label>
                <div className="relative w-full">
                  <button 
                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                    className="w-full flex items-center justify-between h-12 border border-[#e5e5e5] rounded-xl px-4 text-[13px] text-[#161616] font-MontserratMedium appearance-none outline-none focus:border-[#ff6b6b] bg-transparent"
                  >
                    <span className={selectedBank ? "" : "text-gray-400"}>
                      {selectedBank || "Select bank"}
                    </span>
                    <ChevronDown size={18} className={`text-[#666666] transition-transform ${showBankDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showBankDropdown && (
                    <div className="absolute top-13 left-0 w-full max-h-56 overflow-hidden bg-white border border-[#f0f0f0] rounded-xl shadow-lg z-20 flex flex-col">
                      <div className="p-2 border-b border-[#f0f0f0] bg-white sticky top-0">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Search bank..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-9 px-3 text-[12px] font-MontserratMedium bg-gray-50 border border-[#e5e5e5] rounded-lg outline-none focus:border-[#ff6b6b] transition-colors"
                        />
                      </div>

                      <div className="overflow-y-auto max-h-40 py-1">
                        {fetchingBanks ? (
                          <div className="px-4 py-2 text-[12px] text-gray-500 text-center">Loading banks...</div>
                        ) : filteredBanks.length === 0 ? (
                          <div className="px-4 py-3 text-[12px] text-gray-500 text-center">No banks found</div>
                        ) : (
                          filteredBanks.map((bank: any, idx: number) => (
                            <button 
                              key={idx} 
                              onClick={() => {
                                setSelectedBank(bank.name);
                                setSelectedBankCode(bank.code);
                                setShowBankDropdown(false);
                                setSearchQuery("");
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[12px] font-MontserratMedium hover:bg-gray-50 transition-colors ${selectedBank === bank.name ? "bg-[#fff5f5] text-[#ff6b6b]" : "text-[#666666]"}`}
                            >
                              {bank.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Number */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">Account number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 0123456789"
                  className="w-full h-12 border border-[#e5e5e5] rounded-xl px-4 text-[13px] text-[#161616] font-MontserratMedium outline-none focus:border-[#ff6b6b] placeholder:text-[#cccccc]"
                />
              </div>

              {/* BVN */}
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#666666] font-MontserratMedium">BVN</label>
                <input
                  type="text"
                  value={bvn}
                  onChange={(e) => setBvn(e.target.value)}
                  placeholder="e.g. 22222222222"
                  className="w-full h-12 border border-[#e5e5e5] rounded-xl px-4 text-[13px] text-[#161616] font-MontserratMedium outline-none focus:border-[#ff6b6b] placeholder:text-[#cccccc]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 w-full">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl border border-[#ff6b6b] text-[#ff6b6b] font-MontserratSemiBold text-[14px] hover:bg-[#fff5f5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                disabled={submitting || fetchingBanks}
                className="flex-1 h-12 rounded-xl bg-[#ff6b6b] text-white font-MontserratSemiBold text-[14px] hover:bg-[#e55a5a] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? <LoadingSpinner size={20} /> : "Add account"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

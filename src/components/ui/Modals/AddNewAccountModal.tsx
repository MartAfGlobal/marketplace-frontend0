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

interface AddNewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bankDetails: { bank_name: string; account_number: string }) => void;
}

const AddNewAccountModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddNewAccountModalProps) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bvn, setBvn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingBanks, setFetchingBanks] = useState(false);

  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    if (isOpen) {
      setFetchingBanks(true);
      sendHttpRequest({
        requestConfig: {
          url: "/accounts/banks/",
          method: "GET",
          token: token ?? "",
          isAuth: true,
          userType: "seller",
        },
        successRes: (res: any) => {
          setBanks(res?.data || []);
          setFetchingBanks(false);
        },
        errorRes: () => {
          setFetchingBanks(false);
        }
      });
    }
  }, [isOpen, token, sendHttpRequest]);

  const filteredBanks = banks.filter((bank: any) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccount = () => {
    if (!selectedBankCode || !accountNumber || !bvn) {
      toast.error("Please fill in all fields");
      return;
    }

    if (accountNumber.length !== 10) {
      toast.error("Account number must be 10 digits");
      return;
    }

    setSubmitting(true);
    sendHttpRequest({
    
      requestConfig: {
        url: "/accounts/manufacturer/bank/add/",
        method: "POST",
        token: token ?? "",
        isAuth: true,
        userType: "seller",
        body: {
          bank_name: selectedBank,
          
          account_number: accountNumber,
          bvn: bvn,
        },
      },
      successRes: (res: any) => {
        setSubmitting(false);
        toast.success("Verification code sent to your email");
        if (onSuccess) {
          onSuccess({
            bank_name: selectedBank,
            account_number: accountNumber,
          });
        }
      },
      errorRes: (err: any) => {
        setSubmitting(false);
        toast.error(err?.message || "Failed to initiate bank account addition");
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full h-full md:h-auto md:max-w-[426px] flex flex-col  md:bg-white md:rounded-2xl md:shadow-xl"
          >
            <div className="md:hidden py-6">
              <SellerMobileHeader 
                title="Back" 
                onBack={onClose} 
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

            <div className="flex-1  overflow-y-auto pb-10 md:p-8">
              <div className="bg-white p-8 md:p-0">
                {/* Content Header */}
                <div className="text-center mb-8">
                  <h2 className="text-c18 font-MontserratMedium mb-2">Add new account</h2>
                  <p className="text-c12 text-000000/44 font-MontserratMedium">
                    Securely link your bank account to receive payouts.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Bank Name */}
                  <div className="flex flex-col gap-2">
                    <Label>Bank name</Label>
                    <div className="relative w-full">
                      <button 
                        onClick={() => setShowBankDropdown(!showBankDropdown)}
                        className="w-full flex items-center justify-between h-12 md:h-12 border border-[#e5e5e5] rounded-xl px-4 text-[13px] text-[#161616] font-MontserratMedium appearance-none outline-none focus:border-[#ff715b] bg-white transition-all"
                      >
                        <span className={selectedBank ? "" : "text-gray-400"}>
                          {selectedBank || "Select bank"}
                        </span>
                        <ChevronDown size={18} className={`text-[#666666] transition-transform ${showBankDropdown ? "rotate-180" : ""}`} />
                      </button>

                      {showBankDropdown && (
                        <div className="absolute top-[110%] left-0 w-full max-h-56 overflow-hidden bg-white border border-[#f0f0f0] rounded-xl shadow-lg z-[110] flex flex-col">
                          <div className=" border-b border-[#f0f0f0] bg-white sticky top-0">
                            <Input
                              type="text"
                              autoFocus
                              placeholder="Search bank..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              
                            />
                          </div>

                          <div className="overflow-y-auto max-h-40 py-1 hcustom-scroll">
                            {fetchingBanks ? (
                              <div className="px-4 py-4 text-[13px] text-gray-500 text-center">Loading banks...</div>
                            ) : filteredBanks.length === 0 ? (
                              <div className="px-4 py-4 text-[13px] text-gray-500 text-center">No banks found</div>
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
                                  className={`w-full text-left px-4 py-3  hover:bg-gray-50 transition-colors ${selectedBank === bank.name ? "bg-[#fff5f5] text-[#ff715b]" : "text-[#666666]"}`}
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
                    <Label >Account number</Label>
                    <Input
                      type="text"
                      maxLength={10}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 0123456789"
                      className=" "
                    />
                  </div>

                  {/* BVN */}
                  <div className="flex flex-col gap-2">
                    <Label >BVN</Label>
                    <Input
                      type="text"
                      maxLength={11}
                      value={bvn}
                      onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 22222222222"
                      className=" "
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-4 mt-4">
                    <Button
                      onClick={handleAddAccount}
                      
                      disabled={fetchingBanks}
                      className=" "
                    >
                      {submitting ? <LoadingSpinner   />:"Add account"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={onClose}
                      className=" "
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddNewAccountModal;

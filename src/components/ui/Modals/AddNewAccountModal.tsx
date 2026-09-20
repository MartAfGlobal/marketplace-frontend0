"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { X } from "lucide-react";
import CaretDown from "@/assets/Seller/caretDown.png";
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
  const bankDropdownRef = useRef<HTMLDivElement | null>(null);

  const token = useSelector((state: RootState) => state.token.token);
  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bankDropdownRef.current &&
        !bankDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBankDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                    <Label className="uppercase tracking-wider text-[#999999]">Bank name</Label>
                    <div className="relative w-full" ref={bankDropdownRef}>
                      <button 
                        type="button"
                        onClick={() => setShowBankDropdown((prev) => !prev)}
                        className="flex text-c12 font-MontserratNormal bg-white border-[0.5px] border-ff715b items-center w-full p-3 rounded-c8 justify-between h-12 cursor-pointer transition-colors"
                      >
                        <span className={`truncate ${selectedBank ? "text-[#161616] font-MontserratMedium" : "text-ff715b font-MontserratNormal"}`}>
                          {selectedBank || "Select bank"}
                        </span>
                        <Image
                          src={CaretDown}
                          alt="dropdown"
                          width={11}
                          height={6}
                          className={`transition-transform duration-200 ${showBankDropdown ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showBankDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 left-0 mt-2 w-full py-2 px-2 text-c12 font-MontserratNormal bg-white rounded-c8 shadow-lg border border-gray-100 max-h-56 overflow-hidden flex flex-col"
                          >
                            <div className="border-b border-gray-100 pb-2 mb-1">
                              <Input
                                type="text"
                                autoFocus
                                placeholder="Search bank..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-9 text-c12"
                              />
                            </div>

                            <div className="overflow-y-auto max-h-40 py-1">
                              {fetchingBanks ? (
                                <div className="px-3 py-3 text-c12 text-gray-500 text-center">Loading banks...</div>
                              ) : filteredBanks.length === 0 ? (
                                <div className="px-3 py-3 text-c12 text-gray-500 text-center">No banks found</div>
                              ) : (
                                filteredBanks.map((bank: any, idx: number) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => {
                                      setSelectedBank(bank.name);
                                      setSelectedBankCode(bank.code);
                                      setShowBankDropdown(false);
                                      setSearchQuery("");
                                    }}
                                    className={`p-2.5 rounded cursor-pointer transition-colors flex justify-between items-center ${
                                      selectedBank === bank.name 
                                        ? "bg-ff715b/10 text-ff715b font-MontserratSemiBold" 
                                        : "hover:bg-gray-50 text-[#161616]"
                                    }`}
                                  >
                                    <span className="truncate">{bank.name}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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

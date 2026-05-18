"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";
import AddNewAccountModal from "@/components/ui/Modals/AddNewAccountModal";
import VerifyBankOtpModal from "@/components/ui/Modals/VerifyBankOtpModal";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function PayoutSection() {
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState<{ bank_name: string; account_number: string } | null>(null);
  
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  
  const { sendHttpRequest } = useHttp();
  const token = useSelector((state: RootState) => state.token.token);

  const maskAccountNumber = (num: string) => {
    if (!num || num.length < 6) return num;
    return `${num.slice(0, 3)}****${num.slice(-5)}`;
  };

  const fetchBankAccounts = () => {
    if (!token) return;
    setFetching(true);
    sendHttpRequest({
      requestConfig: {
        url: "/accounts/manufacturer/bank/list/",
        method: "GET",
        token: token ?? "",
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        setFetching(false);
        const accounts = res?.data?.results || res?.data || [];
        setBankAccounts(accounts);
      },
      errorRes: () => {
        setFetching(false);
      }
    });
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [token]);

  const handleOpenAddModal = () => {
    setShowBankDropdown(false);
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = (details: { bank_name: string; account_number: string }) => {
    setSelectedBankDetails(details);
    setIsAddModalOpen(false);
    setIsOtpModalOpen(true);
  };

  const handleOtpSuccess = () => {
    console.log("Bank account verified and added!");
    fetchBankAccounts();
  };

  const handleSelectDefault = (account: any) => {
    // Optimistic UI update
    setBankAccounts(prev => prev.map(acc => ({
      ...acc,
      is_default: acc.id === account.id
    })));
    setShowBankDropdown(false);

    // Call standard PATCH viewset endpoint
    sendHttpRequest({
      requestConfig: {
        url: `/accounts/manufacturer/bank/${account.id}/`,
        method: "PATCH",
        token: token ?? "",
        isAuth: true,
        userType: "seller",
        body: {
          is_default: true
        }
      },
      successRes: () => {
        fetchBankAccounts();
      },
      errorRes: () => {
        // Fallback POST set-default if PATCH isn't custom-supported
        sendHttpRequest({
          requestConfig: {
            url: `/accounts/manufacturer/bank/${account.id}/set-default/`,
            method: "POST",
            token: token ?? "",
            isAuth: true,
            userType: "seller",
          },
          successRes: () => {
            fetchBankAccounts();
          },
          errorRes: (err) => {
            console.warn("Could not set default bank on backend:", err);
          }
        });
      }
    });
  };

  // Find default account (where is_default is true) or default to the first one
  const defaultAccount = bankAccounts.find(acc => acc.is_default) || bankAccounts[0] || null;

  return (
    <div id="Payout">
      <AddNewAccountModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleAddSuccess}
      />
      
      <VerifyBankOtpModal 
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onSuccess={handleOtpSuccess}
        onBack={() => {
          setIsOtpModalOpen(false);
          setIsAddModalOpen(true);
        }}
        bankDetails={selectedBankDetails}
      />

      <h2 className="text-c18 font-MontserratNormal text-000000 mb-6 lg:block hidden">Payout settings</h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
         <div className="flex flex-col gap-1">
            <h3 className="text-base font-MontserratSemiBold text-000000">Default payout account</h3>
            <p className="text-c12 text-000000/44 font-MontserratMedium">Choose where wallet withdrawals are made to</p>
         </div>
         
         <div className="relative w-full md:w-64">
            {bankAccounts.length > 0 && defaultAccount ? (
              <>
                {/* Top select button */}
                <button 
                 onClick={() => setShowBankDropdown(!showBankDropdown)}
                 className="w-full flex items-center justify-between h-10 border border-[#e5e5e5] rounded-xl px-4 bg-[#f8f9fa] text-[11px] text-[#333333] font-MontserratMedium hover:bg-gray-50 transition-colors"
                >
                   <span>
                     {defaultAccount.bank_name || defaultAccount.bank} - {maskAccountNumber(defaultAccount.account_number || defaultAccount.number)}
                   </span>
                   <ChevronDown size={14} className={`text-[#666666] transition-transform ${showBankDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown body */}
                {showBankDropdown && (
                  <div className="absolute top-11 left-0 w-full bg-white border border-[#f0f0f0] rounded-xl shadow-lg z-10 overflow-hidden flex flex-col py-1">
                     {bankAccounts.map((account, index) => {
                       const isDefault = account.id === defaultAccount.id;
                       return (
                         <button 
                           key={index} 
                           onClick={() => handleSelectDefault(account)}
                           className={`w-full text-left px-4 py-2.5 text-[10px] transition-colors ${
                             isDefault 
                               ? "bg-[#ff715b] text-white font-MontserratSemiBold" 
                               : "text-[#666666] font-MontserratMedium hover:bg-gray-50"
                           }`}
                         >
                           {account.bank_name || account.bank} - {maskAccountNumber(account.account_number || account.number)}
                         </button>
                       );
                     })}
                     <button 
                       onClick={handleOpenAddModal}
                       className="w-full text-left px-4 py-2.5 text-[#ff715b] text-[10px] font-MontserratSemiBold hover:bg-gray-50 transition-colors border-t border-[#f5f5f5] mt-1"
                     >
                        + Add new account
                     </button>
                  </div>
                )}
              </>
            ) : (
              <button 
               onClick={handleOpenAddModal}
               disabled={fetching}
               className="w-full flex items-center justify-center gap-2 h-10 border border-[#ff715b] border-dashed rounded-lg px-4 bg-[#fff5f5] text-[11px] text-[#ff715b] font-MontserratSemiBold hover:bg-[#ffebeb] transition-colors"
              >
                 <Plus size={14} />
                 <span>{fetching ? "Loading accounts..." : "Add new account"}</span>
              </button>
            )}
         </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import AddNewAccountModal from "@/components/ui/Modals/AddNewAccountModal";
import VerifyBankOtpModal from "@/components/ui/Modals/VerifyBankOtpModal";

export default function PayoutSection() {
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedBankDetails, setSelectedBankDetails] = useState<{ bank_name: string; account_number: string } | null>(null);
  
  const bankAccounts: any[] = [];

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
    // Trigger any necessary data refresh here
  };

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
           {bankAccounts.length > 0 ? (
             <>
               {/* Top select button */}
               <button 
                onClick={() => setShowBankDropdown(!showBankDropdown)}
                className="w-full flex items-center justify-between h-10 border border-[#e5e5e5] rounded-lg px-4 bg-[#f8f9fa] text-[11px] text-[#333333] font-MontserratMedium"
               >
                  <span>{bankAccounts[0].name} - {bankAccounts[0].number}</span>
                  <ChevronDown size={14} className={`text-[#666666] transition-transform ${showBankDropdown ? "rotate-180" : ""}`} />
               </button>

               {/* Dropdown body */}
               {showBankDropdown && (
                 <div className="absolute top-11 left-0 w-full bg-white border border-[#f0f0f0] rounded-xl shadow-lg z-10 overflow-hidden flex flex-col py-1">
                    {bankAccounts.map((account, index) => (
                      <button key={index} className={`w-full text-left px-4 py-2.5 text-[10px] ${index === 0 ? "bg-[#ff6b6b] text-white font-MontserratSemiBold" : "text-[#666666] font-MontserratMedium hover:bg-gray-50 transition-colors"}`}>
                        {account.name} - {account.number}
                      </button>
                    ))}
                    <button 
                      onClick={handleOpenAddModal}
                      className="w-full text-left px-4 py-2.5 text-[#ff6b6b] text-[10px] font-MontserratSemiBold hover:bg-gray-50 transition-colors border-t border-[#f5f5f5] mt-1"
                    >
                       + Add new account
                    </button>
                 </div>
               )}
             </>
           ) : (
             <button 
              onClick={handleOpenAddModal}
              className="w-full flex items-center justify-center gap-2 h-10 border border-[#ff6b6b] border-dashed rounded-lg px-4 bg-[#fff5f5] text-[11px] text-[#ff6b6b] font-MontserratSemiBold hover:bg-[#ffebeb] transition-colors"
             >
                <Plus size={14} />
                <span>Add new account</span>
             </button>
           )}
         </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function LanguageSection() {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div id="Language">
      <h2 className="text-sm font-MontserratSemiBold text-[#333333] mb-6 lg:block hidden">Languages & regions</h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
         <div className="flex flex-col gap-1">
           <h3 className="text-[11px] font-MontserratSemiBold text-[#333333]">Language</h3>
           <p className="text-[10px] text-[#999999] font-MontserratMedium">Choose where wallet withdrawals are made to</p>
         </div>
         
         <div className="relative w-full md:w-44">
           {/* Top select button */}
           <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full flex items-center justify-between h-10 border border-[#e5e5e5] rounded-lg px-4 bg-[#f8f9fa] text-[11px] text-[#333333] font-MontserratMedium"
           >
              <span>English</span>
              <ChevronDown size={14} className={`text-[#666666] transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`} />
           </button>

           {/* Dropdown body */}
           {showLanguageDropdown && (
             <div className="absolute top-11 left-0 w-full bg-white border border-[#f0f0f0] rounded-xl shadow-lg z-10 overflow-hidden flex flex-col py-1">
                <button className="w-full text-left px-4 py-2 bg-[#ff6b6b] text-white text-[10px] font-MontserratSemiBold">
                  English
                </button>
                <button className="w-full text-left px-4 py-2 text-[#666666] text-[10px] font-MontserratMedium hover:bg-gray-50 transition-colors">
                  French
                </button>
                <button className="w-full text-left px-4 py-2 text-[#666666] text-[10px] font-MontserratMedium hover:bg-gray-50 transition-colors">
                   Spanish
                </button>
                <button className="w-full text-left px-4 py-2 text-[#666666] text-[10px] font-MontserratMedium hover:bg-gray-50 transition-colors">
                   Portuguese
                </button>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}


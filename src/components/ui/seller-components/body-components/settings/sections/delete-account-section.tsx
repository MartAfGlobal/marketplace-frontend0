import React from "react";
import { Info } from "lucide-react";

export default function DeleteAccountSection() {
  return (
    <div id="DeleteAccount">
      <h2 className="text-sm font-MontserratSemiBold text-[#333333] mb-6 lg:block hidden">Delete account</h2>
      
      <div className="flex items-center gap-2 text-[#666666] text-[10px] font-MontserratMedium">
        <Info size={14} className="text-[#3b82f6]" />
        <p>
          For account deletion or deactivation, please{" "}
          <span className="text-[#ff6b6b] cursor-pointer hover:underline font-MontserratSemiBold">contact</span>{" "}
          customer support.
        </p>
      </div>
    </div>
  );
}


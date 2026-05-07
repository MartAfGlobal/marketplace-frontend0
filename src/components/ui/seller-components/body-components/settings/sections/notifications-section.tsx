"use client";

import React, { useState } from "react";

export default function NotificationsSection() {
  const [items, setItems] = useState([
    { title: "Security Alerts", desc: "Login attempts, password changes, and suspicious activity", checked: true },
    { title: "Promotions", desc: "Discounts, new arrivals, and newsletters", checked: false },
    { title: "Support Updates", desc: "Responses to inquiries and feedback requests", checked: true },
    { title: "Feature Updates", desc: "New features, improvements, and important changes", checked: false },
    { title: "Order Tracking", desc: "Live updates on shipping and delivery", checked: false },
  ]);

  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);

  return (
    <div id="Notifications">
      <h2 className="text-sm font-MontserratSemiBold text-[#333333] mb-6">Notifications</h2>
      
      <div className="mb-10">
         <h3 className="text-[11px] font-MontserratSemiBold text-[#333333] mb-4">Notify me about</h3>
         
         <div className="flex flex-col gap-5">
            {items.map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  item.checked ? "border-[#FF715B] bg-white" : "border-[#d9d9d9] bg-white group-hover:border-[#FF715B]/50"
                }`}>
                  {item.checked && (
                    <div className="w-2 h-2 bg-[#FF715B] rounded-sm" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-MontserratSemiBold text-[#333333]">{item.title}</span>
                  <span className="text-[10px] text-[#999999] font-MontserratMedium leading-tight">{item.desc}</span>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={item.checked}
                  onChange={() => {
                    const newItems = [...items];
                    newItems[idx].checked = !newItems[idx].checked;
                    setItems(newItems);
                  }}
                />
              </label>
            ))}
         </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between py-2.5">
           <div className="flex flex-col">
             <span className="text-[11px] font-MontserratSemiBold text-[#333333]">Email notifications</span>
             <span className="text-[10px] text-[#999999] font-MontserratMedium">Receive emails</span>
           </div>
           <button 
             onClick={() => setEmailNotify(!emailNotify)}
             className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${emailNotify ? "bg-[#FF715B]" : "bg-gray-200"}`}
           >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${emailNotify ? "right-0.5" : "left-0.5"}`} />
           </button>
        </div>

        <div className="flex items-center justify-between py-2.5">
           <div className="flex flex-col">
             <span className="text-[11px] font-MontserratSemiBold text-[#333333]">Push notifications</span>
             <span className="text-[10px] text-[#999999] font-MontserratMedium">Receive desktop notifications from your browser</span>
           </div>
           <button 
             onClick={() => setPushNotify(!pushNotify)}
             className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${pushNotify ? "bg-[#FF715B]" : "bg-gray-200"}`}
           >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${pushNotify ? "right-0.5" : "left-0.5"}`} />
           </button>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import { Search, User, FileText, Bell, Globe, Lock, Shield, LayoutGrid, Wallet, Info } from "lucide-react";

import ProfileSection from "./sections/profile-section";
import AccountSection from "./sections/account-section";
import PayoutSection from "./sections/payout-section";
import DocumentsSection from "./sections/documents-section";
import NotificationsSection from "./sections/notifications-section";
import LanguageSection from "./sections/language-section";
import PasswordSection from "./sections/password-section";
import PrivacySection from "./sections/privacy-section";
import LegalSection from "./sections/legal-section";
import DeleteAccountSection from "./sections/delete-account-section";

type Tab =
  | "Profile"
  | "Account"
  | "Payout"
  | "Documents"
  | "Notifications"
  | "Language & regions"
  | "Password & security"
  | "Privacy policy"
  | "Legal information";

const tabs: { label: Tab; icon: React.ReactNode; id: string }[] = [
  { label: "Profile", icon: <User size={16} />, id: "Profile" },
  { label: "Account", icon: <LayoutGrid size={16} />, id: "Account" },
  { label: "Payout", icon: <Wallet size={16} />, id: "Payout" },
  { label: "Documents", icon: <FileText size={16} />, id: "Documents" },
  { label: "Notifications", icon: <Bell size={16} />, id: "Notifications" },
  { label: "Language & regions", icon: <Globe size={16} />, id: "Language" },
  { label: "Password & security", icon: <Lock size={16} />, id: "Password" },
  { label: "Privacy policy", icon: <Shield size={16} />, id: "Privacy" },
  { label: "Legal information", icon: <Info size={16} />, id: "Legal" },
];

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tab = tabs.find((t) => t.id === entry.target.id);
            if (tab) {
              setActiveTab(tab.label);
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string, tab: Tab) => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full min-h-screen px-4 md:px-8 pb-20 relative">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pt-4">
        <h1 className="text-xl font-MontserratSemiBold text-[#161616]">Settings</h1>
        <div className="relative mt-4 md:mt-0 w-full md:w-80 h-10 border border-[#e0e0e0] rounded-lg overflow-hidden bg-white flex items-center px-3">
          <Search size={14} className="text-[#999999]" />
          <input
            type="text"
            placeholder="Search by order ID, items, date..."
            className="w-full h-full border-none outline-none px-2 text-[11px] text-[#161616] placeholder:text-[#999999] font-MontserratNormal"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        {/* Sidebar */}
        <div className="w-full md:w-56 flex-shrink-0 bg-white rounded-2xl border border-[#f5f5f5] py-6 shadow-sm md:sticky md:top-24 h-fit z-20">
          <ul className="flex flex-col">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <li key={tab.label} className="relative group">
                  <button
                    onClick={() => scrollToSection(tab.id, tab.label)}
                    className={`flex items-center gap-3 w-full py-3 px-6 text-[11px] transition-all ${
                      isActive 
                        ? "text-[#161616] font-MontserratSemiBold" 
                        : "text-[#666666] font-MontserratMedium hover:bg-gray-50/50"
                    }`}
                  >
                    <span className={`${isActive ? "text-[#161616]" : "text-[#999999] group-hover:text-[#666666]"}`}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                  {/* Active Indicator on the right edge */}
                  {isActive && (
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[3px] h-6 bg-[#ff6b6b] rounded-l-md" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl p-8 md:p-12 mb-20 border border-[#f5f5f5] shadow-sm">
          
          <ProfileSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />
          
          <AccountSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />

          <PayoutSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />
          
          <DocumentsSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />

          <NotificationsSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />

          <LanguageSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />

          <PasswordSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />
          
          <PrivacySection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />

          <LegalSection />
          <div className="w-full h-[1px] bg-[#f5f5f5] my-10" />

          <DeleteAccountSection />

        </div>
      </div>
    </div>
  );
}

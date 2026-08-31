"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, User, FileText, Bell, Globe, Lock, Shield, LayoutGrid, Wallet, Info, ChevronRight, Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useLogout } from "@/utils/logout";
import LogoutConfirmModal from "@/components/ui/Modals/LogoutConfirmModal";
import { SellerMobileHeader } from "../../header-components/SellerMobileHeader";
import Image from "next/image";

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
  | "Legal information"
  | "Delete account";

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
  { label: "Delete account", icon: <Shield size={16} />, id: "Delete" },
];

export default function SellerSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<Tab | null>(null);

  const dispatch = useDispatch();
  const logout = useLogout(dispatch);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const seller = useSelector((state: RootState) => state.seller.data);
  const profile = seller?.profile;

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

  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      const tab = tabs.find(t => t.id === section);
      if (tab) {
        setActiveTab(tab.label);
        setActiveMobileTab(tab.label);
        
        // Use a small timeout to ensure DOM is ready
        setTimeout(() => {
          scrollToSection(tab.id, tab.label);
        }, 100);
      }
    }
  }, [searchParams]);

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

  const mobileSections: { label: string; tab: Tab }[] = [
    { label: "Business profile", tab: "Profile" },
    { label: "Account settings", tab: "Account" },
    { label: "Payout settings", tab: "Payout" },
    { label: "Documents", tab: "Documents" },
    { label: "Notifications", tab: "Notifications" },
    { label: "Language & regions", tab: "Language & regions" },
    { label: "Password & security", tab: "Password & security" },
    { label: "Delete account", tab: "Delete account" },
  ];

  const renderSection = (tab: Tab) => {
    switch (tab) {
      case "Profile": return <ProfileSection />;
      case "Account": return <AccountSection />;
      case "Payout": return <PayoutSection />;
      case "Documents": return <DocumentsSection />;
      case "Notifications": return <NotificationsSection />;
      case "Language & regions": return <LanguageSection />;
      case "Password & security": return <PasswordSection />;
      case "Privacy policy": return <PrivacySection />;
      case "Legal information": return <LegalSection />;
      case "Delete account": return <DeleteAccountSection />;
      default: return <ProfileSection />;
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Desktop Layout (lg and above) */}
      <div className="hidden lg:block w-full px-4 md:px-8 pb-20">
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

        <div className="flex flex-row gap-8 items-start relative">
          <div className="w-56 flex-shrink-0 bg-white rounded-2xl border border-[#f5f5f5] py-6 shadow-sm sticky top-24 h-fit z-20">
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
                    {isActive && (
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[3px] h-6 bg-[#ff6b6b] rounded-l-md" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

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

      {/* Mobile Layout (below lg) */}
      <div className="lg:hidden flex flex-col w-full  min-h-screen  pb-10">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 mb-6 text-[#161616]">
          <ChevronRight size={24} className="rotate-180" />
          <span className="text-xl font-MontserratSemiBold">Settings</span>
        </button>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f5f5]">
          {/* Profile Image with Camera Icon */}
          <div className="relative mb-8  w-26 h-26">
            <div className="w-26 h-26 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
              {profile?.company_logo_url ? (
                <img 
                  src={profile.company_logo_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#6a0dad]/10 text-[#6a0dad] text-2xl font-bold font-MontserratBold">
                  {profile?.company_name?.charAt(0) || "S"}
                </div>
              )}
            </div>
            <button className="absolute bottom-0 -right-1.5 w-c48-15 h-c48-15 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
               <Camera size={19.63} className="text-[#ff715b]" />
            </button>
          </div>

          {/* Accordion Menu */}
          <div className="w-full flex flex-col gap-2 mb-6">
            {mobileSections.map((section) => {
              const isExpanded = activeMobileTab === section.tab;
              return (
                <div key={section.tab} className="w-full">
                  <button 
                    onClick={() => setActiveMobileTab(isExpanded ? null : section.tab)}
                    className="w-full flex items-center justify-between py-4"
                  >
                    <span className="text-c18 font-MontserratNormal shrink-0">
                      {section.label}
                    </span>
                    
                    <div className="flex-1 flex items-center gap-4 ml-4">
                      <div className="flex-1 h-[1px] bg-[#f0f0f0]" />
                      {isExpanded ? (
                         <ChevronRight size={18} className="text-[#161616] rotate-90 transition-transform" />
                      ) : (
                         <ChevronRight size={18} className="text-[#999999]" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {renderSection(section.tab)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Log out Button */}
          <button 
            onClick={() => setLogoutModalOpen(true)}
            className="w-full py-4 border border-[#ff715b] rounded-xl text-[#ff715b] font-MontserratSemiBold text-sm bg-white hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onConfirm={() => { setLogoutModalOpen(false); logout(); }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </div>
  );
}

"use client"
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Menu, ShoppingCart, User, ChevronDown, X, Globe, DollarSign, Anchor } from "lucide-react";
import Image from "next/image";
import { SignUpPopup } from "@/components/martaf/AuthPopups/SignUpPopup";
import { SignInPopup } from "@/components/martaf/AuthPopups/SignInPopup";
import { VerifyEmailPopup } from "@/components/martaf/AuthPopups/VerifyEmailPopup";
import { CheckInboxPopup } from "@/components/martaf/AuthPopups/CheckInboxPopup";
import { ForgotPasswordPopup } from "@/components/martaf/AuthPopups/ForgotPasswordPopup";
import { ResetPasswordPopup } from "@/components/martaf/AuthPopups/ResetPasswordPopup";
import { PasswordUpdatedPopup } from "@/components/martaf/AuthPopups/PasswordUpdatedPopup";
import { AllDonePopup } from "@/components/martaf/AuthPopups/AllDonePopup";

const countries = [
  { code: "NG", name: "Nigeria", flag: "https://flagcdn.com/ng.svg" },
  { code: "FR", name: "France", flag: "https://flagcdn.com/fr.svg" },
  { code: "US", name: "USA", flag: "https://flagcdn.com/us.svg" },
];

const categories = [
  {
    name: "Fashion & Apparel",
    icon: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    sub: ["Shoes & footwear", "Men's wear", "Women's wear"],
  },
  {
    name: "Electronics & Gadgets",
    icon: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    sub: ["Phones", "Tablets", "Laptops & Desktop"],
  },
  { name: "Home & Living", icon: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Groceries & Essentials", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Health & Beauty", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Books, Media & Education", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Travel & Luggage", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Automotive & Industrial", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Kids & Babies", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
  { name: "Culture-specific", icon: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", sub: [] },
];

const languages = [
  { name: "English", flag: "https://flagcdn.com/gb.svg" },
  { name: "French", flag: "https://flagcdn.com/fr.svg" },
  { name: "Spanish", flag: "https://flagcdn.com/es.svg" },
  { name: "Portuguese", flag: "https://flagcdn.com/pt.svg" },
];

const Header = () => {
  const [selectedCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  // Auth drawer state
  const [authOpen, setAuthOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'signin'|'signup'|'verify'|'checkinbox'|'forgot'|'reset'|'updated'|'done'>("signin");
  
  // Handlers for popup transitions
  const handleSignUpSuccess = () => setAuthStep("checkinbox"); // Go to check inbox after signup
  const handleSignInSuccess = () => setAuthOpen(false); // Close drawer after successful sign in
  const handleGoogleSignIn = () => setAuthStep("checkinbox");
  const handleSignInToSignUp = () => setAuthStep("signup");
  const handleSignUpToSignIn = () => setAuthStep("signin");
  const handleForgotPassword = () => setAuthStep("forgot");
  const handleVerifyBack = () => setAuthStep("signup");
  const handleCheckInboxBack = () => setAuthStep("signup");
  const handleForgotBack = () => setAuthStep("signin");
  const handleResetBack = () => setAuthStep("signin");
  const handlePasswordUpdatedBack = () => setAuthStep("signin");
  const handleAllDoneBack = () => setAuthOpen(false);

  return (
    <header className="w-full bg-[#7C2AE8] text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Hamburger for mobile */}
        <div className="sm:hidden flex items-center">
          <button aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="w-[90vw] max-w-xs p-0 h-screen">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <span className="flex items-center gap-2">
                    <span className="text-[#7C2AE8] font-black text-2xl">M</span>
                    <span className="font-bold text-xl text-black">MARTAF</span>
                  </span>
                  <button onClick={() => setOpen(false)}><X className="w-7 h-7 text-black" /></button>
                </div>
                <div className="overflow-y-auto flex-1 px-4 pb-4">
                  <div className="text-2xl font-bold mt-4 mb-2 text-black">Categories</div>
                  <div className="flex flex-col gap-3 mb-6">
                    {categories.map((cat) => (
                      <div key={cat.name}>
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === cat.name ? null : cat.name)}>
                          <Image src={cat.icon} alt={cat.name} width={36} height={36} className="rounded-full object-cover" />
                          <span className="font-semibold text-base text-black flex-1">{cat.name}</span>
                          {cat.sub.length > 0 && <ChevronDown className={`w-5 h-5 text-black transition-transform ${expanded === cat.name ? 'rotate-180' : ''}`} />}
                        </div>
                        {cat.sub.length > 0 && expanded === cat.name && (
                          <div className="ml-12 mt-1 flex flex-col gap-1">
                            {cat.sub.map((sub) => (
                              <div key={sub} className="text-black text-sm py-0.5">{sub}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-xl font-bold mb-2 text-black">Settings</div>
                  <div className="flex items-center gap-2 mb-4 text-black"><DollarSign className="w-5 h-5" /> Currency</div>
                  <div className="text-xl font-bold mb-2 text-black">Language</div>
                  <div className="flex flex-col gap-2 mb-4">
                    {languages.map((lang) => (
                      <div key={lang.name} className="flex items-center gap-2 text-black">
                        <Image src={lang.flag} alt={lang.name} width={24} height={24} className="rounded-full" />
                        <span>{lang.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-black"><Anchor className="w-5 h-5" /> Ship to</div>
                </div>
                <div className="flex gap-2 p-4 border-t">
                  <Button 
                    className="flex-1 bg-white text-[#FF715B] border border-[#FF715B] hover:bg-[#FF715B] hover:text-white" 
                    variant="outline"
                    onClick={() => { setOpen(false); setAuthOpen(true); setAuthStep('signin'); }}
                  >
                    Sign in
                  </Button>
                  <Button 
                    className="flex-1 bg-[#FF715B] text-white hover:bg-[#ff4d2d]"
                    onClick={() => { setOpen(false); setAuthOpen(true); setAuthStep('signup'); }}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl font-black">M</span>
          <span className="font-bold text-xl tracking-wide">MARTAF</span>
        </a>
        {/* Right icons */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-[#FF715B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">1</span>
          </div>
          {/* Profile/User icon triggers auth drawer */}
          <div>
            <User className="w-6 h-6 cursor-pointer" onClick={() => { setAuthOpen(true); setAuthStep('signin'); }} />
            {/* Auth flow popups */}
            {authStep === 'signin' && (
              <SignInPopup
                open={authOpen}
                onOpenChange={setAuthOpen}
                onSignUp={handleSignInToSignUp}
                onForgotPassword={handleForgotPassword}
                onGoogleSignIn={handleGoogleSignIn}
                onSuccess={handleSignInSuccess}
              />
            )}
            {authStep === 'signup' && (
              <SignUpPopup
                open={authOpen}
                onOpenChange={setAuthOpen}
                onSignIn={handleSignUpSuccess}
                onGoogleSignIn={handleGoogleSignIn}
                onSignInLink={handleSignUpToSignIn}
              />
            )}
            {authStep === 'verify' && (
              <VerifyEmailPopup
                open={authOpen}
                onOpenChange={setAuthOpen}
                onBack={handleVerifyBack}
              />
            )}
            {authStep === 'checkinbox' && (
              <CheckInboxPopup
                open={authOpen}
                onOpenChange={setAuthOpen}
                onBack={handleCheckInboxBack}
              />
            )}
            {authStep === 'forgot' && (
              <ForgotPasswordPopup
                open={authOpen}
                onOpenChange={setAuthOpen}
                onBack={handleForgotBack}
              />
            )}
            {authStep === 'reset' && (
              <ResetPasswordPopup 
                open={authOpen}
                onOpenChange={setAuthOpen}
                onBack={handleResetBack} 
              />
            )}
            {authStep === 'updated' && (
              <PasswordUpdatedPopup 
                open={authOpen}
                onOpenChange={setAuthOpen}
                onBack={handlePasswordUpdatedBack} 
              />
            )}
            {authStep === 'done' && (
              <AllDonePopup 
                open={authOpen}
                onOpenChange={setAuthOpen}
                onBack={handleAllDoneBack} 
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base font-semibold">NG</span>
            <Image src={selectedCountry.flag} alt="flag" width={24} height={24} className="rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
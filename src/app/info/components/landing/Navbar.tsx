"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X as CloseIcon } from "lucide-react";

interface NavbarProps {
  onJoinWaitlist: () => void;
}

export default function Navbar({ onJoinWaitlist }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] backdrop-blur-xl px-6 md:px-18 h-13.75 flex items-center justify-between bg-ffffff/80 border-b border-efefef md:border-none">
        <div className="w-8" />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-c18 font-MontserratNormal text-000000">
          <Link href="#" className="hover:text-6a0dad transition-colors">Home</Link>
          <Link href="#" className="hover:text-6a0dad transition-colors">Shop</Link>
          <Link href="#" className="hover:text-6a0dad transition-colors">About us</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-000000"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[120] md:hidden shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-end items-center mb-12">
                <button onClick={() => setIsMenuOpen(false)} className="p-2">
                  <CloseIcon size={28} className="text-000000" />
                </button>
              </div>
              
              <div className="flex flex-col gap-6 text-xl font-MontserratMedium text-000000">
                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-6a0dad transition-colors">Home</Link>
                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-6a0dad transition-colors">Shop</Link>
                <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-6a0dad transition-colors">About us</Link>
                
                <div className="mt-8 pt-8 border-t border-efefef space-y-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onJoinWaitlist();
                    }}
                    className="w-full bg-6a0dad text-white py-4 rounded-full font-MontserratSemiBold shadow-lg"
                  >
                    Join Waitlist
                  </button>
                  
                  {/* <Link 
                    href="/info/manager/update" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-sm font-MontserratMedium text-000000/40 hover:text-6a0dad transition-colors"
                  >
                    Manager Tools
                  </Link> */}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

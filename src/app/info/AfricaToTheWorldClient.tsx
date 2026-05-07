"use client";

import React, { useState } from "react";
import Footer from "@/components/ui/Footer/Footer";
import WaitlistModal from "./WaitlistModals";

// Components
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import ShowcaseSection from "./components/landing/ShowcaseSection";
import MapSection from "./components/landing/MapSection";
import TargetSection from "./components/landing/TargetSection";
import CTASection from "./components/landing/CTASection";

export default function AfricaToTheWorldClient() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const closeWaitlist = () => setIsWaitlistOpen(false);

  return (
    <div className="bg-ffffff min-h-screen font-MontserratNormal text-161616 overflow-x-hidden">
      {/* Navigation */}
      <Navbar onJoinWaitlist={openWaitlist} />

      {/* Hero Section */}
      <HeroSection onJoinWaitlist={openWaitlist} />

      {/* Showcase Section (Infinite Marquee) */}
      <ShowcaseSection />

      {/* Map Section (Infrastructure & Building With) */}
      <MapSection />

      {/* Target Section (Who is Martaf for? & Journey) */}
      <TargetSection />

      {/* CTA Section */}
      <CTASection onJoinWaitlist={openWaitlist} />

      {/* Footer */}
      <Footer />

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={closeWaitlist} 
      />
    </div>
  );
}

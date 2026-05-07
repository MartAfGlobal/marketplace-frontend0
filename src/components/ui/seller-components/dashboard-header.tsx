"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import DashBoardHeadrLogo from "./header-components/logo";
import NavigationBar from "./header-components/navBars";
import EndNav from "./header-components/endNavBar";
import MobileDrawer from "./mobile/MobileDrawer";

export default function DashBoardHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="w-full py-3 md:h-18 justify-between bg-6a0dad text-ffffff flex items-center px-4 md:px-8 lg:px-c56 fixed top-0 z-[60]">
      {/* Mobile Menu Button */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={32} />
        </button>

        <div className=" md:flex-initial  flex justify-center md:justify-start">
          <DashBoardHeadrLogo />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center">
        <NavigationBar />
      </div>

      <div className=" md:block">
        <EndNav />
      </div>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/assets/images/logo.svg";
import { usePublicSettings } from "@/helpers/usePublicSettings";

/**
 * Locks buyers and sellers out of the whole app while maintenance mode is
 * on, showing the admin-set maintenance message. Staff/admin keep working
 * in the admin dashboard, so /dashboard/admin and /auth/admin are exempt
 * (the backend also lets staff through; this is the matching UI).
 *
 * Fail-open: the screen only shows when maintenance_mode is explicitly
 * true. If settings haven't loaded or the fetch failed, children render as
 * normal -- a glitch here must never white-screen the platform.
 */
export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const settings = usePublicSettings();

  const isAdminArea =
    pathname.startsWith("/dashboard/admin") || pathname.startsWith("/auth/admin");

  if (settings?.maintenance_mode === true && !isAdminArea) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7ff] px-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-black/5 p-10 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Image src={Logo} alt="MartAf" width={34} height={42} />
            <span className="font-MontserratBold text-2xl text-[#6a0dad]">MARTAF</span>
          </div>
          <h1 className="text-xl font-MontserratSemiBold text-[#161616]">
            We&apos;ll be right back
          </h1>
          <p className="text-sm text-black/60 mt-3 leading-relaxed whitespace-pre-wrap">
            {settings.maintenance_message}
          </p>
          <div className="mt-8 h-1 w-24 mx-auto rounded-full bg-[#ff715b]/30 overflow-hidden">
            <div className="h-full w-1/2 bg-[#ff715b] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

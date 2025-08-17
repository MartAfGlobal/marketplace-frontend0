"use client";

import { usePathname } from "next/navigation";
import Header from "../landindPage/Header/Header";
import FooterPage from "../Footer/Footer";
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Optional chaining + nullish check to avoid error on initial render
  const hideLayout = pathname?.startsWith("/auth") ?? false;

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <FooterPage />}
    </>
  );
}

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

  // Hide layout for auth pages
  const hideLayout = pathname?.startsWith("/auth") ?? false;

const productPage = ["/product", "/cart"].some(path => pathname?.startsWith(path));

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {/* Hide footer on auth pages and on mobile product pages */}
      {!hideLayout &&
        (productPage ? (
          <div className="hidden md:block">
            <FooterPage />
          </div>
        ) : (
          <FooterPage />
        ))}
    </>
  );
}

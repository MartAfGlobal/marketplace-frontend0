"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../landindPage/Header/Header";
import FooterPage from "../Footer/Footer";
import { ReactNode } from "react";
import WireframeLoader from "../WireframeLoader";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

   const [loading, setLoading] = useState(true);
  
      useEffect(() => {
      // Simulate data fetching
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);
  
    if (loading) return <WireframeLoader/>;

  // Hide layout for auth pages
  const hideLayout = pathname?.startsWith("/auth") ?? false;

const productPage = ["/product", "/cart", "/dashboard"].some(path => pathname?.startsWith(path));

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

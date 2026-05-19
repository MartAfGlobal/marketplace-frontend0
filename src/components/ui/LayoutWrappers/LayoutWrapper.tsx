"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../landindPage/Header/Header";
import FooterPage from "../Footer/Footer";
import { ReactNode } from "react";
import WireframeLoader from "../WireframeLoader";
import { useTokenExpiration } from "@/hooks/useTokenExpiration";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  useTokenExpiration();

    const [loading, setLoading] = useState(true);
  
      useEffect(() => {
      setLoading(false);
    }, []);
  
    if (loading) return <WireframeLoader/>;

  const hideLayout = ["/auth", "/dashboard/seller", "/dashboard/admin", "/informative", "/info"].some((path) =>
    pathname?.includes(path)
  );


const productPage = ["/product", "/cart", "/dashboard"].some(path => pathname?.startsWith(path));

  return (
    <>
      {!hideLayout && <Header />}
     
       {children}
     
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

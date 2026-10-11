"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../landindPage/Header/Header";
import FooterPage from "../Footer/Footer";
import { ReactNode } from "react";
import WireframeLoader from "../WireframeLoader";
import { useTokenExpiration } from "@/hooks/useTokenExpiration";
import { useSelector, useDispatch } from "react-redux";
import ResultModal from "../forms/resultModal";
import { closeGlobalResultModal } from "@/store/uiSlice";
import { RootState } from "@/store";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  // Every protected or app-shell page should validate whether current auth tokens are still valid.
  // This is a global safety net; route-level screens can rely on this hook instead of repeating
  // logic in each page.
  useTokenExpiration();
  const dispatch = useDispatch();
  const resultModal = useSelector((state: RootState) => state.ui?.resultModal);

  // The initial loader exists to prevent a flash of stale content during route transitions or early
  // auth checks. In practice this keeps the app shell from rendering partial content before the
  // client has finished the first hydration pass.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <WireframeLoader />;

  // Certain route families intentionally do not render the public app shell (header/footer) because
  // they already provide their own dashboard or auth layout. This avoids duplicate navigation chrome.
  const hideLayout = ["/auth", "/dashboard/seller", "/dashboard/admin", "/informative", "/info"].some((path) =>
    pathname?.includes(path)
  );

  // Product and cart routes use a slightly different footer treatment on larger screens. The intent
  // appears to be a cleaner single-column product experience with the footer hidden on mobile for some
  // views, even though the logic is centralized here.
  const productPage = ["/product", "/cart", "/dashboard"].some(path => pathname?.startsWith(path));

  return (
    <>
      <ResultModal
        isOpen={resultModal?.isOpen || false}
        result={resultModal?.result as any}
        title={resultModal?.title}
        message={resultModal?.message}
        onCancel={() => dispatch(closeGlobalResultModal())}
      />
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

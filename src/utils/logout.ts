// utils/logout.ts
"use client";

import { AppDispatch } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clearStoredAuthTokens } from "@/utils/authStorage";

// ✅ Plain logout function (no hooks here)
export const logout = (
  dispatch: AppDispatch,
  router: any,
  isSeller?: boolean
) => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  try {
    clearStoredAuthTokens();
       
    // Clear redux token
    dispatch(tokenActions.deleteToken());
    
    // Clear redirect URL on manual logout so next login goes to overview
    if (typeof window !== "undefined") {
      localStorage.removeItem("sellerRedirectUrl");
    }

    // Redirect based on role
    if (isSeller) {
      router.push("/auth/seller/login");
    } else {
      if (isMobile) {
        // Go to landing page and tell it to open login modal
        router.replace("/?showLogin=true");
      } else {
        // Desktop → go to dedicated login page
        router.replace("/auth/login");
      }
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// ✅ Hook wrapper for React components
export const useLogout = (dispatch: AppDispatch) => {
  const router = useRouter();
  const pathname = usePathname();

  // detect seller from URL
  const isSeller = pathname.startsWith("/dashboard/seller");

  return () => logout(dispatch, router, isSeller);
};

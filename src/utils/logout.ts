// utils/logout.ts
"use client";

import { AppDispatch } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

// ✅ Plain logout function (no hooks here)
export const logout = (
  dispatch: AppDispatch,
  router: any,
  isSeller?: boolean
) => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  try {
    // Remove token from localStorage
    localStorage.removeItem("token");
       Cookies.remove("userAuthId");

    // Clear redux token
    dispatch(tokenActions.deleteToken());
    
    // Save current url before redirecting to login
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl.startsWith("/dashboard/seller")) {
         localStorage.setItem("sellerRedirectUrl", currentUrl);
      }
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
  const searchParams = useSearchParams();

  // detect seller from URL
  const isSeller = searchParams.get("seller") !== null;

  return () => logout(dispatch, router, isSeller);
};

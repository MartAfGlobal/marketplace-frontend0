// utils/logout.ts
"use client";

import { AppDispatch } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { clearAdminInfo } from "@/store/admin/adminInfoSlice";
import { useRouter, usePathname } from "next/navigation";
import { clearStoredAuthTokens } from "@/utils/authStorage";
import axios from "@/lib/axios";

// Shared logout routine for role-aware redirects, callable from both React components and the hook wrapper below.
export const logout = async (
  dispatch: AppDispatch,
  router: any,
  isSeller?: boolean,
  isAdmin?: boolean,
  token?: string | null,
  currentPath?: string
) => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Notify the API when possible, but always clear local credentials even if the network request fails.
  if (token) {
    try {
      await axios.post(
        "/accounts/logout/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch {
      // Silently ignore — we still clear local state regardless
    }
  }

  try {
    clearStoredAuthTokens();

    // Clear redux token
    dispatch(tokenActions.deleteToken());
    dispatch(clearAdminInfo());

    // Clear redirect URL on manual logout so next login goes to overview
    if (typeof window !== "undefined") {
      localStorage.removeItem("sellerRedirectUrl");
    }

    // Return each account type to its own sign-in entry point; preserve the cart route for buyer checkout.
    if (isAdmin) {
      router.replace("/auth/admin/login");
    } else if (isSeller) {
      router.push("/auth/seller/login");
    } else if (currentPath?.startsWith("/cart")) {
      router.replace("/cart");
    } else {
      if (isMobile) {
        router.replace("/?showLogin=true");
      } else {
        router.replace("/auth/login");
      }
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Bind the shared logout routine to the current route and Next.js router for component use.
export const useLogout = (dispatch: AppDispatch) => {
  const router = useRouter();
  const pathname = usePathname();

  const isSeller = pathname.startsWith("/dashboard/seller");
  const isAdmin = pathname.startsWith("/dashboard/admin");

  // Read token from localStorage so we can pass it to the API call
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      null
    );
  };

  return () => logout(dispatch, router, isSeller, isAdmin, getToken(), pathname);
};

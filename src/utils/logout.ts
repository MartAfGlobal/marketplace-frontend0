// utils/logout.ts
"use client";

import { AppDispatch } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { useRouter, usePathname } from "next/navigation";
import { clearStoredAuthTokens } from "@/utils/authStorage";
import axios from "@/lib/axios";

// ✅ Plain logout function (no hooks here)
export const logout = async (
  dispatch: AppDispatch,
  router: any,
  isSeller?: boolean,
  isAdmin?: boolean,
  token?: string | null
) => {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Fire-and-forget the server-side logout — don't block on it
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

    // Clear redirect URL on manual logout so next login goes to overview
    if (typeof window !== "undefined") {
      localStorage.removeItem("sellerRedirectUrl");
    }

    // Redirect based on role
    if (isAdmin) {
      router.replace("/auth/admin/login");
    } else if (isSeller) {
      router.push("/auth/seller/login");
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

// ✅ Hook wrapper for React components
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

  return () => logout(dispatch, router, isSeller, isAdmin, getToken());
};

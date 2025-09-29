// utils/logout.ts
"use client";

import { AppDispatch } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Plain logout function (no hooks here)
export const logout = (dispatch: AppDispatch, router: any, isSeller?: boolean) => {
  try {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Clear redux token
    dispatch(tokenActions.deleteToken());

    // Redirect based on role
    if (isSeller) {
      router.push("/auth/seller/login");
    } else {
      router.push("/auth/login");
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

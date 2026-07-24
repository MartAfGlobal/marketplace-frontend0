"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "@/lib/axios";
import { tokenActions } from "@/store/token/token-slice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const tryRefresh = async () => {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken") ||
            localStorage.getItem("refresh") ||
            localStorage.getItem("refresh_token")
          : null;

      // Only attempt initial refresh if user has a refresh token stored
      if (!refreshToken) return;

      try {
        const newAccess = await refreshAccessToken();
        if (mounted && newAccess) {
          dispatch(tokenActions.setToken(newAccess));
        }
      } catch (err) {
        console.debug("Initial refresh silent failure:", err);
      }
    };

    tryRefresh();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return null;
}

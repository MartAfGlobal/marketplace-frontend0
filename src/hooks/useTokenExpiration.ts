"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { usePathname, useRouter } from "next/navigation";
import { clearStoredAuthTokens } from "@/utils/authStorage";

function isTokenExpired(token: string) {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return true;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    // Add a 5 minute buffer so we don't use tokens about to expire
    const currentTime = Math.floor(Date.now() / 1000) + 300;
    return exp < currentTime;
  } catch {
    return true;
  }
}

export const useTokenExpiration = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentUrl = () =>
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : pathname;

  const getLoginPath = () => {
    if (pathname.startsWith("/dashboard/admin")) {
      return "/auth/admin/login";
    }
    if (pathname.startsWith("/dashboard/seller")) {
      return "/auth/seller/login";
    }
    return "/auth/login";
  };

  useEffect(() => {
    const isProtectedPath =
      pathname.startsWith("/dashboard/admin") ||
      pathname.startsWith("/dashboard/seller") ||
      pathname.startsWith("/dashboard/buyer") ||
      pathname.startsWith("/cart/checkout");

    if (!isProtectedPath) return;

    // Check if token exists in localStorage/cookies as a fallback
    const storedToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          null
        : null;

    const effectiveToken = token || storedToken;

    if (!effectiveToken || isTokenExpired(effectiveToken)) {
      clearStoredAuthTokens();
      dispatch(tokenActions.deleteToken());

      const currentUrl = getCurrentUrl();
      if (pathname.startsWith("/dashboard/seller")) {
        localStorage.setItem("sellerRedirectUrl", currentUrl);
      }

      const loginPath = getLoginPath();
      router.replace(`${loginPath}?from=${encodeURIComponent(currentUrl)}`);
    } else if (!token && storedToken) {
      // Sync stored token to Redux
      dispatch(tokenActions.setToken(storedToken));
    }
  }, [token, dispatch, pathname, router]);
};

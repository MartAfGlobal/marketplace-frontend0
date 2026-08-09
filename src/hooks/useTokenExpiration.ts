"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { usePathname } from "next/navigation";
import { clearStoredAuthTokens } from "@/utils/authStorage";

function isTokenExpired(token: string) {
  if (!token) return true;
  try {
    const base64Url = token!.split(".")[1];
    if (!base64Url) return true;
    
    // Polyfill for React Native/Node base64 decoding (though Window.atob is generally available in browsers)
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
  } catch (error) {
    return true; // if we can't parse it, treat as expired
  }
}

import { useRouter } from "next/navigation";

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
    if (!token) {
      if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/seller")) {
        const loginPath = getLoginPath();
        const currentUrl = getCurrentUrl();
        router.replace(`${loginPath}?from=${encodeURIComponent(currentUrl)}`);
      }
      return;
    }

    if (token && isTokenExpired(token!)) {
      dispatch(tokenActions.deleteToken());
      clearStoredAuthTokens();
      console.log("Token expired on load/navigation - clearing local state.");

      const isManagerPage = pathname.startsWith("/info/manager");
      if (isManagerPage) return;

      const loginPath = getLoginPath();
      const currentUrl = getCurrentUrl();
      router.replace(`${loginPath}?from=${encodeURIComponent(currentUrl)}`);
    }
  }, [token, dispatch, pathname, router]);
};

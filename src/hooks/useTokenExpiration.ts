"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { tokenActions } from "@/store/token/token-slice";
import { usePathname } from "next/navigation";

function isTokenExpired(token: string) {
  if (!token) return true;
  try {
    const base64Url = token.split(".")[1];
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

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        dispatch(tokenActions.deleteToken());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("token");
        console.log("Token expired on load/navigation - clearing local state.");
        
        const isManagerPage = pathname.startsWith("/info/manager");
        if (isManagerPage) return;

        const isSeller = pathname.startsWith("/dashboard/seller");
        if (isSeller) {
          router.replace("/auth/seller/login");
        } else {
          router.replace("/auth/login");
        }
      }
    }
  }, [token, dispatch, pathname, router]);
};

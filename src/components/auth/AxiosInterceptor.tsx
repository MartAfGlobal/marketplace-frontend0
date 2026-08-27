"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/Provider";
import { tokenActions } from "@/store/token/token-slice";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { clearStoredAuthTokens } from "@/utils/authStorage";

export default function AxiosInterceptor({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Extract error message if available
          let errorMessage = "Session expired. Please login again.";
          const data = error.response?.data;
          
          if (data) {
            const extractFirstString = (obj: any): string | null => {
              if (typeof obj === "string") return obj;
              if (Array.isArray(obj)) {
                for (const item of obj) {
                  const res = extractFirstString(item);
                  if (res) return res;
                }
              } else if (typeof obj === "object" && obj !== null) {
                for (const key of Object.keys(obj)) {
                  const res = extractFirstString(obj[key]);
                  if (res) return res;
                }
              }
              return null;
            };

            const foundMessage = extractFirstString(data);
            if (foundMessage) {
              errorMessage = foundMessage;
            }
          }

          const isTokenError =
            error.response?.status === 401 ||
            errorMessage.toLowerCase().includes("token") ||
            errorMessage.toLowerCase().includes("credentials were not provided");

          if (isTokenError) {
            // Token expired or unauthorized
            dispatch(tokenActions.deleteToken());
            clearStoredAuthTokens();

            const currentPath = window.location.pathname;
            const isManagerPage = currentPath.startsWith("/info/manager");
            const isAuthPage = currentPath.startsWith("/auth/");
            
            if (isManagerPage || isAuthPage) {
              return Promise.reject(error);
            }

            const isSeller = currentPath.startsWith("/dashboard/seller");
            const isAdmin = currentPath.startsWith("/dashboard/admin");
            const currentUrl = currentPath + window.location.search;

            if (isSeller) {
              localStorage.setItem("sellerRedirectUrl", currentUrl);
            }

            toast.error(
              errorMessage.toLowerCase().includes("token")
                ? errorMessage
                : "Session expired. Please login again.",
              { id: "session-expired" }
            );

            if (isAdmin) {
              router.replace(`/auth/admin/login?from=${encodeURIComponent(currentUrl)}`);
            } else if (isSeller) {
              router.replace(`/auth/seller/login?from=${encodeURIComponent(currentUrl)}`);
            } else {
              router.replace(`/auth/login?from=${encodeURIComponent(currentUrl)}`);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch, router]);

  return <>{children}</>;
}

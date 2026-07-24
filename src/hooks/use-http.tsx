import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import axios from "@/lib/axios";
import { HttpRequestConfigProps } from "@/types/global";
import { tokenActions } from "@/store/token/token-slice";
import { openGlobalResultModal } from "@/store/uiSlice";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();


  const sendHttpRequest = useCallback(
    async ({ successRes, requestConfig, errorRes }: HttpRequestConfigProps) => {
      setError(null);

      if (!requestConfig.token && requestConfig.isAuth) {
        // Clear any stored token
        dispatch(tokenActions.deleteToken());

        if (typeof window !== "undefined") {
          const currentUrl = window.location.pathname + window.location.search;
          console.log(
            "Auto-redirect to login disabled. Current URL:",
            currentUrl,
          );
          // if (window.location.pathname.startsWith("/dashboard/admin")) {
          //   router.replace(`/auth/admin/login?from=${encodeURIComponent(currentUrl)}`);
          // } else if (window.location.pathname.startsWith("/dashboard/seller")) {
          //   router.replace(`/auth/seller/login?from=${encodeURIComponent(currentUrl)}`);
          // } else {
          //   router.replace(`/auth/login?from=${encodeURIComponent(currentUrl)}`);
          // }
        }

        setError("Please login!");
        // toast.error("Please login!");
        return;
      }

      setLoading(true);

      try {
        const isFormData = requestConfig.body && (
          requestConfig.body instanceof FormData ||
          requestConfig.body.constructor?.name === "FormData" ||
          (typeof requestConfig.body === "object" && typeof requestConfig.body.append === "function")
        );

        console.log("isFormData:", requestConfig.body instanceof FormData);
        console.log("body:", requestConfig.body);

        if (requestConfig.body instanceof FormData) {
          for (const [key, value] of requestConfig.body.entries()) {
            console.log("check key and value", key, value);
          }
        }

        const config = {
          url: requestConfig.url,
          method: requestConfig.method,
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(requestConfig.token && {
              Authorization: `Bearer ${requestConfig.token}`,
            }),
          },
          ...(requestConfig.params && { params: requestConfig.params }),
          ...(requestConfig.body && { data: requestConfig.body }),
        };

        console.log("config:", config);

        const res = await axios.request(config);

        if (res.status >= 200 && res.status < 300) {
          if (requestConfig.successMessage) {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              dispatch(openGlobalResultModal({
                result: "success",
                title: "Success",
                message: requestConfig.successMessage
              }));
            } else {
              toast.success(requestConfig.successMessage);
            }
          }
          successRes(res);
        }
      } catch (error: any) {
        await errorRes?.(error);
        console.log("Error in HTTP request:", error);
        console.log("Full error response:", error?.response);

        let errorMessage: string = "Something went wrong. Please try again.";

        if (error.code === "ERR_NETWORK") {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error?.response?.data) {
          const data = error.response.data;
          const contentType = error.response.headers?.["content-type"];

          // Check if data is HTML and should be ignored as a message
          const isHtml =
            typeof data === "string" &&
            (data.trim().startsWith("<!DOCTYPE") ||
              data.trim().startsWith("<html") ||
              contentType?.includes("text/html"));

          if (!isHtml) {
            // Extract the first message dynamically regardless of nesting depth
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
        }
        const isTokenError = 
          error?.response?.status === 401 || 
          (error?.response?.status === 403 && (
            errorMessage.toLowerCase().includes("token") || 
            errorMessage.toLowerCase().includes("credentials were not provided") ||
            errorMessage.toLowerCase().includes("not valid")
          ));

        if (isTokenError) {
          errorMessage = "Token expired";
          dispatch(tokenActions.deleteToken());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          console.log(
            "Unauthorized access - cleared token",
            errorMessage
          );

          if (requestConfig.isAuth) {
            const inferredUserType =
              requestConfig.userType ??
              (typeof window !== "undefined" &&
              window.location.pathname.startsWith("/dashboard/admin")
                ? "admin"
                : "seller");

            if (typeof window !== "undefined") {
              const currentUrl =
                window.location.pathname + window.location.search;
              if (currentUrl.startsWith("/dashboard/seller")) {
                localStorage.setItem("sellerRedirectUrl", currentUrl);
              }
            }

            if (inferredUserType === "admin") {
              if (typeof window !== "undefined") {
                const currentUrl =
                  window.location.pathname + window.location.search;
                router.replace(
                  `/auth/admin/login?from=${encodeURIComponent(currentUrl)}`,
                );
              } else {
                router.replace("/auth/admin/login");
              }
            } else if (inferredUserType === "seller") {
              if (typeof window !== "undefined") {
                const currentUrl =
                  window.location.pathname + window.location.search;
                router.replace(
                  `/auth/seller/login?from=${encodeURIComponent(currentUrl)}`,
                );
              } else {
                router.replace("/auth/seller/login");
              }
            } else {
              if (typeof window !== "undefined") {
                const currentUrl =
                  window.location.pathname + window.location.search;
                router.replace(
                  `/auth/login?from=${encodeURIComponent(currentUrl)}`,
                );
              } else {
                router.replace("/auth/login");
              }
            }
          }
        }

        setError(errorMessage);
        if (!error?.response?.data?.requires_2fa) {
          const isSilentTokenError = isTokenError && !requestConfig.isAuth;
          if (!isSilentTokenError) {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              dispatch(openGlobalResultModal({
                result: "error",
                title: "Error",
                message: errorMessage
              }));
            } else {
              toast.error(errorMessage, { id: isTokenError ? "token-expired" : errorMessage });
            }
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [router, dispatch],
  );

  return {
    loading,
    sendHttpRequest,
    error,
    setError,
  };
};

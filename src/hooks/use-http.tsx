import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import axios from "@/lib/axios";
import { HttpRequestConfigProps } from "@/types/global";
import { tokenActions } from "@/store/token/token-slice";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  const sendHttpRequest = useCallback(
    async ({ successRes, requestConfig }: HttpRequestConfigProps) => {
      setError(null);

      if (!requestConfig.token && requestConfig.isAuth) {
        // Clear any stored token
        dispatch(tokenActions.deleteToken());

        if (requestConfig.userType === "seller") {
          router.replace("/auth/seller/login");
        }

        setError("Please login!");
        toast.error("Please login!");
        return;
      }

      setLoading(true);

      try {
        const isFormData = requestConfig.body instanceof FormData;

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
            toast.success(requestConfig.successMessage);
          }
          successRes(res);
        }
      } catch (error: any) {
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

          // Extract the first message dynamically
          if (typeof data === "object") {
            const firstKey = Object.keys(data)[0];
            const firstValue = data[firstKey];

            if (Array.isArray(firstValue)) {
              errorMessage = firstValue[0];
            } else if (typeof firstValue === "string") {
              errorMessage = firstValue;
            }
          }
        }
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          errorMessage = "Please login!";
          dispatch(tokenActions.deleteToken());

          const userType = requestConfig.userType ?? "seller"; // default buyer
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

          if (userType === "seller") {
            router.replace("/auth/seller/login");
          } else {
            if (isMobile) {
              // Go to landing page and tell it to open login modal
              router.replace("/?showLogin=true");
            } else {
              // Desktop → go to dedicated login page
              router.replace("/auth/login");
            }
          }
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router, dispatch]
  );

  return {
    loading,
    sendHttpRequest,
    error,
    setError,
  };
};
"use client";

import { useState, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { tokenActions } from "@/store/token/token-slice";
import { buyerActions, buyerInitialData } from "@/store/user-data/buyer/buyer-slice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseGoogleAuthOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  fromPage?: string | null;
}

/**
 * Decodes the payload of a JWT without verification (for extracting display info only).
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  /**
   * Called after Google gives us an access_token (implicit flow).
   * We use it to fetch the user's Google ID token via tokeninfo,
   * then send it to our backend.
   */
  const onGoogleSuccess = useCallback(
    async (tokenResponse: { access_token: string }) => {
      setLoading(true);
      try {
        // Get the user's profile info from Google using the access token
        const userInfoRes = await Axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const googleUser = userInfoRes.data;

        // Send the Google access token to our backend
        const res = await Axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/auth/google/`,
          {
            token: tokenResponse.access_token,
            user_type: "buyer",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = res?.data?.data ?? res?.data;
        const accessToken = data?.access || data?.token || data?.accessToken;
        const refreshToken =
          data?.refresh || data?.refresh_token || data?.refreshToken;

        if (!accessToken) {
          throw new Error(
            "No access token received from authentication server."
          );
        }

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        dispatch(tokenActions.setToken(accessToken));

        // Populate buyer data in Redux
        const user = data?.buyerDetails || data?.user || data;
        dispatch(
          buyerActions.updateBuyerData({
            ...buyerInitialData,
            id: user?.id ? String(user.id) : "",
            email: user?.email ?? googleUser?.email ?? "",
            first_name:
              user?.first_name ?? googleUser?.given_name ?? "",
            last_name:
              user?.last_name ?? googleUser?.family_name ?? "",
            is_google_user: true,
            account_status: user?.account_status ?? "active",
            profile: {
              ...buyerInitialData.profile,
              id: user?.profile?.id ?? 0,
              profile_picture:
                user?.profile?.profile_picture ?? googleUser?.picture ?? null,
              first_name:
                user?.first_name ?? googleUser?.given_name ?? "",
              last_name:
                user?.last_name ?? googleUser?.family_name ?? "",
              name:
                user?.profile?.name ?? googleUser?.name ?? "",
            },
          })
        );

        toast.success("Signed in with Google successfully!");

        if (options.onSuccess) {
          options.onSuccess(data);
        } else {
          const destination =
            options.fromPage &&
            options.fromPage !== "/auth/login" &&
            options.fromPage !== "/auth/register" &&
            options.fromPage !== "/auth/buyer/sign-up"
              ? options.fromPage
              : "/";
          router.push(destination);
        }
      } catch (err: any) {
        console.error("Google Auth error:", err);
        if (err?.response) {
          console.error(
            "Backend response status:",
            err.response.status
          );
          console.error(
            "Backend response data:",
            JSON.stringify(err.response.data, null, 2)
          );
        }
        const errorMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Google authentication failed. Please try again.";

        toast.error(errorMsg);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, router, options]
  );

  const googleLogin = useGoogleLogin({
    onSuccess: onGoogleSuccess,
    onError: (error) => {
      console.error("Google Login error:", error);
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      options.onError?.(error);
    },
    onNonOAuthError: () => {
      // User closed popup — exit silently
      setLoading(false);
    },
  });

  const handleGoogleAuth = () => {
    setLoading(true);
    googleLogin();
  };

  return { handleGoogleAuth, loading };
}

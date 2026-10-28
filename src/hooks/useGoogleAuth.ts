"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { tokenActions } from "@/store/token/token-slice";
import { buyerActions, buyerInitialData } from "@/store/user-data/buyer/buyer-slice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setStoredAccountType } from "@/utils/authStorage";

interface UseGoogleAuthOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  fromPage?: string | null;
  userType?: "buyer" | "seller";
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );
  } catch {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleCredential = async (idToken: string) => {
    if (!idToken) {
      toast.error("No Google token received. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // 1. Authenticate Firebase with the Google credential
      try {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } catch (firebaseErr: any) {
        console.warn("Firebase sign-in with credential warning:", firebaseErr);
      }

      // 2. Send the Google ID Token directly to the backend
      const res = await Axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${
          options.userType === "seller"
            ? "/manufacturer/auth/google/"
            : "/accounts/auth/google/"
        }`,
        {
          token: idToken,
          id_token: idToken,
          user_type: options.userType ?? "buyer",
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
        throw new Error("No access token received from authentication server.");
      }

      // 3. Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setStoredAccountType(options.userType ?? "buyer");
      dispatch(tokenActions.setToken(accessToken));

      // 4. Populate Redux
      if (options.userType !== "seller") {
        const googlePayload = decodeJwtPayload(idToken) || {};
        const user = data?.buyerDetails || data?.user || data;
        const firstName = user?.first_name ?? googlePayload?.given_name ?? "";
        const lastName = user?.last_name ?? googlePayload?.family_name ?? "";
        const displayName =
          user?.name ??
          googlePayload?.name ??
          `${firstName} ${lastName}`.trim();

        dispatch(
          buyerActions.updateBuyerData({
            ...buyerInitialData,
            id: user?.id ? String(user.id) : googlePayload?.sub ?? "",
            email: user?.email ?? googlePayload?.email ?? "",
            first_name: firstName,
            last_name: lastName,
            is_google_user: true,
            account_status: user?.account_status ?? "active",
            profile: {
              ...buyerInitialData.profile,
              id: user?.profile?.id ?? 0,
              profile_picture:
                user?.profile?.profile_picture ?? googlePayload?.picture ?? null,
              first_name: firstName,
              last_name: lastName,
              name: displayName,
            },
          })
        );
      }

      toast.success("Signed in with Google successfully!");

      if (options.onSuccess) {
        options.onSuccess(data);
      } else if (options.userType === "seller") {
        const authPages = ["/auth/seller/login", "/auth/seller/sign-up"];
        if (options.fromPage && !authPages.includes(options.fromPage)) {
          router.push(options.fromPage);
        } else {
          const redirectUrl = localStorage.getItem("sellerRedirectUrl");
          if (redirectUrl) {
            localStorage.removeItem("sellerRedirectUrl");
            router.push(redirectUrl);
          } else {
            router.push("/dashboard/seller/overview");
          }
        }
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
  };

  return { handleGoogleCredential, loading };
}

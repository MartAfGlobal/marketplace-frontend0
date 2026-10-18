"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import axios from "@/lib/axios";
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

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // 1. Open Google Sign-In Popup
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Extract Google credential / ID token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleIdToken = credential?.idToken;
      const firebaseIdToken = await result.user.getIdToken();

      const tokenToSend = googleIdToken || firebaseIdToken;

      if (!tokenToSend) {
        throw new Error("Unable to retrieve Google authentication token.");
      }

      // 3. Authenticate with backend
      const res = await axios.post("/accounts/auth/google/", {
        token: tokenToSend,
        user_type: "buyer",
      });

      const data = res?.data?.data ?? res?.data;
      const accessToken = data?.access || data?.token || data?.accessToken;
      const refreshToken =
        data?.refresh || data?.refresh_token || data?.refreshToken;

      if (!accessToken) {
        throw new Error("No access token received from authentication server.");
      }

      // 4. Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      dispatch(tokenActions.setToken(accessToken));

      // 5. Populate buyer data in Redux
      const user = data?.buyerDetails || data?.user || data;
      dispatch(
        buyerActions.updateBuyerData({
          ...buyerInitialData,
          id: user?.id ? String(user.id) : result.user.uid,
          email: user?.email ?? result.user.email ?? "",
          first_name:
            user?.first_name ?? result.user.displayName?.split(" ")[0] ?? "",
          last_name:
            user?.last_name ??
            result.user.displayName?.split(" ").slice(1).join(" ") ??
            "",
          is_google_user: true,
          account_status: user?.account_status ?? "active",
          profile: {
            ...buyerInitialData.profile,
            id: user?.profile?.id ?? 0,
            profile_picture:
              result.user.photoURL ?? user?.profile?.profile_picture ?? null,
            first_name:
              user?.first_name ?? result.user.displayName?.split(" ")[0] ?? "",
            last_name:
              user?.last_name ??
              result.user.displayName?.split(" ").slice(1).join(" ") ??
              "",
            name: result.user.displayName ?? user?.profile?.name ?? "",
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
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        // User closed popup; exit without alarming
        return;
      }

      if (err?.code === "auth/popup-blocked") {
        toast.error("Popup was blocked by your browser. Please allow popups for this site.");
        return;
      }

      if (err?.code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorized in Firebase Console. Please add it to Authorized Domains.");
        return;
      }

      if (err?.code === "auth/configuration-not-found") {
        toast.error("Google Sign-In is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.");
        console.error(
          "Firebase Error: auth/configuration-not-found.\n" +
          "To fix this, go to Firebase Console:\n" +
          "1. Open https://console.firebase.google.com/project/martaf-ca7e6/authentication/providers\n" +
          "2. Click 'Get Started' (if not yet enabled)\n" +
          "3. Under 'Sign-in providers', click 'Google'\n" +
          "4. Enable the toggle, set the project support email, and click 'Save'."
        );
        return;
      }

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

  return { handleGoogleAuth, loading };
}

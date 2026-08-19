"use client";

import React, { useState, useEffect } from "react";
import ResetPasswordModal from "@/components/ui/Modals/update-password-modal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import ResultModal from "@/components/ui/forms/resultModal";
import Confirm2faPasswordModal from "@/components/ui/Modals/confirm-2fa-password-modal";
import { sellerActions } from "@/store/user-data/seller/seller-slice";

export default function PasswordSection() {
  const dispatch = useDispatch();

  // ── Auth ──────────────────────────────────────────────────────────────
  const token = useSelector((state: RootState) => state.token.token);

  // ── Local UI state ────────────────────────────────────────────────────
  const [tfa, setTfa] = useState<boolean | null>(null); // null = loading
  const [googleLink, setGoogleLink] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState("Success");
  const [successMsg, setSuccessMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ── HTTP hooks ────────────────────────────────────────────────────────
  const { loading: fetching2fa, sendHttpRequest: fetch2faStatusReq } = useHttp();
  const { loading: updatingPassword, sendHttpRequest: updatePasswordReq } = useHttp();
  const { loading: toggling2fa, sendHttpRequest: toggle2faReq } = useHttp();

  // ── Fetch real 2FA status from /accounts/2fa/toggle/ on mount ─────────
  useEffect(() => {
    if (!token) return;

    fetch2faStatusReq({
      requestConfig: {
        url: "/accounts/2fa/toggle/",
        method: "GET",
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        // API may return { two_factor_enabled: bool } or { enabled: bool } or { is_enabled: bool }
        const status =
          res?.data?.two_factor_enabled ??
          res?.data?.enabled ??
          res?.data?.is_enabled ??
          res?.data?.tfa_enabled ??
          false;
        setTfa(Boolean(status));
        // Keep Redux in sync
        dispatch(sellerActions.updateSellerData({ two_factor_enabled: Boolean(status) } as any));
      },
      errorRes: () => {
        // If the status fetch fails, fall back to false (safe default)
        setTfa(false);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSavePassword = (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const activeToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null);

    updatePasswordReq({
      requestConfig: {
        url: "/accounts/password/change",
        method: "POST",
        token: activeToken ?? undefined,
        isAuth: true,
        userType: "seller",
        body: {
          old_password: passwords.currentPassword,
          new_password: passwords.newPassword,
          confirm_password: passwords.confirmPassword,
        },
      },
      successRes: (res: any) => {
        setIsResetModalOpen(false);
        setSuccessTitle("Success");
        setSuccessMsg(
          res?.message || res?.data?.message || "Your password was successfully updated."
        );
        setShowSuccessModal(true);
      },
      errorRes: (err: any) => {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          (typeof err.response?.data === "string" ? err.response?.data : null) ||
          err.message ||
          "Failed to update password.";
        setErrorMessage(msg);
        setShowErrorModal(true);
      },
    });
  };

  const handleToggle2FA = (password: string) => {
    const newState = !tfa;
    toggle2faReq({
      requestConfig: {
        url: "/accounts/2fa/toggle/",
        method: "POST",
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
        body: {
          enabled: newState,
          password,
        },
      },
      successRes: (res: any) => {
        // Re-read the confirmed state from the response if available
        const confirmedState =
          res?.data?.two_factor_enabled ??
          res?.data?.enabled ??
          res?.data?.is_enabled ??
          newState;
        setIs2faModalOpen(false);
        setTfa(Boolean(confirmedState));
        dispatch(
          sellerActions.updateSellerData({ two_factor_enabled: Boolean(confirmedState) } as any)
        );
        setSuccessTitle("Two-Factor Authentication");
        setSuccessMsg(`2FA has been successfully ${confirmedState ? "enabled" : "disabled"}.`);
        setShowSuccessModal(true);
      },
      errorRes: (err: any) => {
        setIs2faModalOpen(false);
        setErrorMessage(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to toggle 2FA."
        );
        setShowErrorModal(true);
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div id="Password">
      <h2 className="text-sm font-MontserratSemiBold text-[#333333] mb-6 lg:block hidden">
        Password &amp; security
      </h2>

      <div className="flex flex-col gap-6">
        {/* Two-factor authentication row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-MontserratSemiBold text-[#333333]">
              Two-factor authentication
            </span>
            <span className="text-[10px] text-[#999999] font-MontserratMedium">
              Use an authenticator or SMS OTP each time you login
            </span>
          </div>

          {/* Show a subtle skeleton while the status is loading */}
          {tfa === null || fetching2fa ? (
            <div className="w-9 h-5 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <button
              onClick={() => setIs2faModalOpen(true)}
              aria-label={tfa ? "Disable two-factor authentication" : "Enable two-factor authentication"}
              className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                tfa ? "bg-[#ff6b6b]" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  tfa ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          )}
        </div>

        {/* Change password row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-MontserratSemiBold text-[#333333]">
              Change password
            </span>
            <span className="text-[10px] text-[#999999] font-MontserratMedium">
              Update password to maintain account integrity
            </span>
          </div>
          <button
            className="text-[#ff6b6b] text-[11px] font-MontserratSemiBold hover:underline"
            onClick={() => setIsResetModalOpen(true)}
          >
            Update password
          </button>
        </div>

        {/* Third-party accounts */}
        <div className="pt-2">
          <h3 className="text-[11px] font-MontserratSemiBold text-[#333333] mb-4">
            Third-party accounts
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[11px] font-MontserratSemiBold text-[#333333]">Google</span>
            </div>
            <button
              onClick={() => setGoogleLink(!googleLink)}
              aria-label={googleLink ? "Unlink Google account" : "Link Google account"}
              className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                googleLink ? "bg-[#ff6b6b]" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  googleLink ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onSave={handleSavePassword}
        loading={updatingPassword}
      />

      <Confirm2faPasswordModal
        isOpen={is2faModalOpen}
        onClose={() => setIs2faModalOpen(false)}
        onConfirm={handleToggle2FA}
        loading={toggling2fa}
        isEnabled={tfa ?? false}
      />

      <ResultModal
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        result="success"
        title={successTitle}
        message={successMsg}
        buttenText="Okay"
      />

      <ResultModal
        isOpen={showErrorModal}
        onConfirm={() => setShowErrorModal(false)}
        result="error"
        title="Failed"
        message={errorMessage}
        buttenText="Okay"
      />
    </div>
  );
}

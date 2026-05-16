"use client";

import React, { useState } from "react";
import ResetPasswordModal from "@/components/ui/Modals/update-password-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import ResultModal from "@/components/ui/forms/resultModal";

export default function PasswordSection() {
  const [tfa, setTfa] = useState(false);
  const [googleLink, setGoogleLink] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const token = useSelector((state: RootState) => state.token.token);
  const { loading: updatingPassword, sendHttpRequest: updatePasswordReq } = useHttp();

  const handleSavePassword = (passwords: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    updatePasswordReq({
      requestConfig: {
        url: "/accounts/manufacturer/profile-update/",
        method: "PATCH",
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
        body: {
          password: passwords.newPassword,
          old_password: passwords.currentPassword,
        },
      },
      successRes: (res: any) => {
        setIsResetModalOpen(false);
        setShowSuccessModal(true);
      },
      errorRes: (err: any) => {
        setErrorMessage(err.response?.data?.message || err.message || "Failed to update password.");
        setShowErrorModal(true);
      }
    });
  };

  return (
    <div id="Password">
      <h2 className="text-sm font-MontserratSemiBold text-[#333333] mb-6">Password & security</h2>
      
      <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-MontserratSemiBold text-[#333333]">Two-factor authentication</span>
              <span className="text-[10px] text-[#999999] font-MontserratMedium">Use an authenticator or SMS OTP each time you login</span>
            </div>
            <button 
              onClick={() => setTfa(!tfa)}
              className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${tfa ? "bg-[#ff6b6b]" : "bg-gray-200"}`}
            >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${tfa ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-MontserratSemiBold text-[#333333]">Change password</span>
              <span className="text-[10px] text-[#999999] font-MontserratMedium">Update password to maintain account integrity</span>
            </div>
            <button 
              className="text-[#ff6b6b] text-[11px] font-MontserratSemiBold hover:underline"
              onClick={() => setIsResetModalOpen(true)}
            >
              Update password
            </button>
          </div>

          <div className="pt-2">
            <h3 className="text-[11px] font-MontserratSemiBold text-[#333333] mb-4">Third-party accounts</h3>
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
                  className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${googleLink ? "bg-[#ff6b6b]" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${googleLink ? "right-0.5" : "left-0.5"}`} />
                </button>
            </div>
          </div>
      </div>
      
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onSave={handleSavePassword}
        loading={updatingPassword}
      />

      <ResultModal 
        isOpen={showSuccessModal}
        onConfirm={() => setShowSuccessModal(false)}
        result="success"
        title="Success"
        message="Your password was successfully updated."
        buttenText="Okay"
      />

      <ResultModal 
        isOpen={showErrorModal}
        onConfirm={() => setShowErrorModal(false)}
        result="error"
        title="Update Failed"
        message={errorMessage}
        buttenText="Okay"
      />
    </div>
  );
}


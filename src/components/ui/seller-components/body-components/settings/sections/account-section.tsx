"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { useHttp } from "@/hooks/use-http";
import ResultModal from "@/components/ui/forms/resultModal";
import { sellerActions } from "@/store/user-data/seller/seller-slice";

export default function AccountSection() {
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const token = useSelector((state: RootState) => state.token.token);
  const dispatch = useDispatch();
  const { loading, sendHttpRequest } = useHttp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (sellerData) {
      setEmail(sellerData.email || "");
      setPhone(sellerData.profile?.phone || "");
    }
  }, [sellerData]);

  const handleApplyChanges = () => {
    sendHttpRequest({
      requestConfig: {
        url: "/accounts/manufacturer/email-phone-update/",
        method: "PATCH",
        body: { email, phone },
        token: token ?? undefined,
        isAuth: true,
        userType: "seller",
      },
      successRes: (res: any) => {
        dispatch(
          sellerActions.updateSellerData({
            email,
            profile: {
              ...(sellerData?.profile as any),
              phone,
            },
          })
        );
        setIsEditing(false);
        setShowSuccessModal(true);
      },
    });
  };

  return (
    <div id="Account">
      <ResultModal
        isOpen={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        buttenText="Close"
        result="success"
        title="Success!"
        message="Account details updated successfully."
      />
      <h2 className="text-sm font-MontserratSemiBold text-[#333333] mb-6 lg:block hidden">Account settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="flex flex-col gap-2">
          <Label className="">Email address</Label>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            className={`transition-all ${
              isEditing
                ? "text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`} 
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Mobile number</Label>
          <Input 
            type="text" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            className={`transition-all ${
              isEditing
                ? "text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-2">
        {isEditing ? (
          <button 
            onClick={handleApplyChanges}
            disabled={loading}
            className="text-[#ff6b6b] text-sm font-MontserratNormal hover:underline disabled:opacity-50"
          >
            {loading ? "Applying..." : "Apply changes"}
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-[#ff6b6b] text-sm font-MontserratNormal hover:underline transition-opacity"
          >
            Edit account
          </button>
        )}
      </div>
    </div>
  );
}




"use client";

import React, { useState, useEffect } from "react";
import { Camera, Info } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import profileImage from "@/assets/icons/profile-averter.svg";
import SellerProfileImageModal from "@/components/ui/Modals/SellerProfileImageModal";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";

export default function ProfileSection() {
  const sellerData = useSelector((state: RootState) => state.seller.data);
  const profile = sellerData?.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    business_type: "",
    business_registration_number: "",
    company_country: "",
    company_state: "",
    company_city: "",
    company_postal_code: "",
    shipping_zone: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        business_type: profile.business_type || "",
        business_registration_number:
          profile.business_registration_number || "",
        company_country: profile.company_country || profile.country || "",
        company_state: profile.company_state || profile.state || "",
        company_city: profile.company_city || profile.city || "",
        company_postal_code:
          profile.company_postal_code || profile.postal_code || "",
        shipping_zone: profile.shipping_zone || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyChanges = () => {
    console.log("Saving profile changes:", formData);
    setIsEditing(false);
  };

  return (
    <div id="Profile">
      <SellerProfileImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={profile?.profile_picture_url || null}
        onUpload={(file) => console.log("Uploaded file:", file)}
        onRemove={() => console.log("Removed profile image")}
      />

      {/* Profile Picture */}
      <div className="mb-6 lg:block hidden">
        <div className="relative w-24 h-24">
          <div className="w-full h-full relative rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-[#f0f0f0]">
            {profile?.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={profileImage}
                alt="Default Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* Edit icon overlay */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-white border border-[#f0f0f0] w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 text-[#ff6b6b] hover:bg-gray-50 transition-colors"
          >
            <Camera size={14} />
          </button>
        </div>
      </div>

      {/* Business Profile Title */}
      <h2 className="text-c18 font-MontserratNormal text-000000 mb-6 lg:block hidden">
        Business profile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-6">
        <div className="flex flex-col gap-2">
          <Label className="">Store name</Label>
          <Input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={` transition-all ${
              isEditing
                ? " text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Business type</Label>
          <Input
            type="text"
            name="business_type"
            value={
              profile?.is_registered_business
                ? "Registered business"
                : "Individual"
            }
            readOnly={true}
            className="bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Registration number</Label>
          <Input
            type="text"
            name="business_registration_number"
            value={formData.business_registration_number}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={` transition-all ${
              isEditing
                ? " text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6">
        <div className="flex flex-col gap-2 font-MontserratMedium">
          <Label className="">Country</Label>
          <Input
            type="text"
            name="company_country"
            value={formData.company_country}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={` transition-all ${
              isEditing
                ? " text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`}
          />
        </div>
        <div className="flex flex-col gap-2 font-MontserratMedium">
          <Label className="">State</Label>
          <Input
            type="text"
            name="company_state"
            value={formData.company_state}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`transition-all ${
              isEditing
                ? "bg-white  text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-[#999999] cursor-not-allowed"
            }`}
          />
        </div>
        <div className="flex flex-col gap-2 font-MontserratMedium">
          <Label className="">City</Label>
          <Input
            type="text"
            name="company_city"
            value={formData.company_city}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={` transition-all ${
              isEditing
                ? " text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`}
          />
        </div>
        <div className="flex flex-col gap-2 font-MontserratMedium">
          <Label className="">Postal code</Label>
          <Input
            type="text"
            name="company_postal_code"
            value={formData.company_postal_code}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={` transition-all ${
              isEditing
                ? " text-[#161616]"
                : "bg-transparent border-[#e5e5e5] text-000000/44 cursor-not-allowed"
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-8 text-[#666666] text-xs">
        {!isEditing && <Info size={24} className="text-[#3b82f6]" />}
        {isEditing ? (
          <button
            onClick={handleApplyChanges}
            className="text-[#ff6b6b] font-MontserratSemiBold text-[12px] hover:underline"
          >
            Apply changes
          </button>
        ) : (
          <p className="font-MontserratMedium">
            For any changes in these section, please{" "}
            <span
              onClick={() => setIsEditing(true)}
              className="text-[#ff6b6b] cursor-pointer hover:underline"
            >
              contact
            </span>{" "}
            customer support.
          </p>
        )}
      </div>
    </div>
  );
}

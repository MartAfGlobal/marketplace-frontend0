"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useHttp } from "@/hooks/use-http";
import { BuyerEditParams } from "@/types/global";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Assets
import NavBack from "@/assets/icons/navBacksmall.png";
import profilePicture from "@/assets/icons/user-dashboard/profile-picture.png";
import User from "@/assets/mobile/User.png";
import Phone from "@/assets/mobile/Phone.png";
import Mobile from "@/assets/mobile/mobile.png";

export default function MobileEditProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tokenSlice = useSelector((state: any) => state.token);
  const { token } = tokenSlice;
  const buyer = useSelector((state: any) => state.buyer.BuyerData);

  const { loading, sendHttpRequest: editRegisterUserReq } = useHttp();

  // Local state (prefilled from buyer if available)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<BuyerEditParams>(() => ({
    first_name: buyer?.first_name || "",
    last_name: buyer?.last_name || "",
    phone: buyer?.profile?.phone || "",
    phone2: buyer?.profile?.phone2 || "",
  }));

  // ✅ Sync form values with buyer data when it updates
  useEffect(() => {
    if (buyer) {
      setFormData({
        first_name: buyer.first_name || "",
        last_name: buyer.last_name || "",
        phone: buyer.profile?.phone || "",
        phone2: buyer.profile?.phone2 || "",
      });
    }
  }, [buyer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleeditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("first_name", formData.first_name ?? "");
    form.append("last_name", formData.last_name ?? "");
    form.append("phone", formData.phone ?? "");
    form.append("phone2", formData.phone2 ?? "");

    if (selectedFile) {
      form.append("profile_picture", selectedFile);
    }

    editRegisterUserReq({
      successRes: () => {
        toast.success("Profile updated successfully!");
        router.push(`/dashboard/buyer`);
      },
      requestConfig: {
        url: "/accounts/UserDetails/",
        method: "PATCH",
        body: form,
        token,
        isAuth: true,
        userType: "buyer",
        successMessage: "Profile updated successfully.",
      },
    });
  };

  return (
    <form onSubmit={handleeditSubmit} className="px-6">
      {/* Back Button */}
      <div className="pb-7">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Account
          </p>
        </button>
      </div>

      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex justify-center items-center overflow-hidden">
          <div className="flex justify-center h-26 w-26 m-auto">
            {selectedFile || buyer?.profile?.profile_picture ? (
              <Image
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : (buyer?.profile?.profile_picture as string)
                }
                alt="Profile"
                width={104}
                height={104}
                className="rounded-full object-cover"
              />
            ) : (
              <Image
                src={profilePicture}
                alt="Default"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            )}
          </div>
        </div>
        <div>
          <label className="cursor-pointer font-MontserratSemiBold text-c12 text-ff715b">
            Upload image
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="mt-c32 space-y-4">
        {/* First Name */}
        <div>
          <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
            First name
          </label>
          <div className="flex items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
            <Image src={User} alt="first name" width={16} height={16} className="mr-2" />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
            Last Name
          </label>
          <div className="flex items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
            <Image src={User} alt="surname" width={16} height={16} className="mr-2" />
            <input
              type="text"
              name="last_name"
              placeholder="Surname"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
            Phone Number
          </label>
          <div className="flex items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
            <Image src={Phone} alt="phone" width={16} height={16} className="mr-2" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
            Mobile Number
          </label>
          <div className="flex items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
            <Image src={Mobile} alt="mobile" width={16} height={16} className="mr-2" />
            <input
              type="text"
              name="phone2"
              placeholder="Mobile Number"
              value={formData.phone2}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 py-c32 text-c12 font-MontserratSemiBold">
        <motion.button
          type="button"
          onClick={() => router.back()}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 rounded-c8 border border-ff715b text-ff715b"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="flex-1 py-3 rounded-c8 flex justify-center items-center bg-ff715b text-white disabled:opacity-50"
        >
          {loading ? <LoadingSpinner /> : "Save"}
        </motion.button>
      </div>
    </form>
  );
}

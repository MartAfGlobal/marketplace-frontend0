"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import NavBack from "@/assets/icons/navBacksmall.png";
import profilePicture from "@/assets/icons/user-dashboard/profile-picture.png";

// Icons
import User from "@/assets/mobile/User.png";
import Mail from "@/assets/mobile/email.png";
import Phone from "@/assets/mobile/Phone.png";
import Mobile from "@/assets/mobile/mobile.png";

export default function MobileEditProfile() {
  const router = useRouter();

  // Hybrid type for profile image
  const [image, setImage] = useState<string | StaticImageData>(profilePicture);

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    mobile: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = URL.createObjectURL(e.target.files[0]);
      setImage(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-6">
      {/* Back Button */}
      <div className="pb-7">
        <button
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
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={image}
            alt="Profile Image"
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <label className="cursor-pointer font-MontserratSemiBold text-c12 text-ff715b">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
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
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Surname */}
        <div>
          <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
            Surname
          </label>
          <div className="flex items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
            <Image src={User} alt="surname" width={16} height={16} className="mr-2" />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="font-MontserratNormal text-c12 text-000000/60 mb-2 block">
            Email
          </label>
          <div className="flex items-center border border-000000/15 rounded-lg px-4 py-2 focus-within:ring-1 focus-within:ring-[#FF715B] focus-within:border-[#FF715B]">
            <Image src={Mail} alt="email" width={16} height={16} className="mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 py-c32 text-c12 font-MontserratSemiBold">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 rounded-c8 border border-ff715b text-ff715b "
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 rounded-c8 bg-ff715b text-white "
        >
          Save
        </motion.button>
      </div>
    </div>
  );
}

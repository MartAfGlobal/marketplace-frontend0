"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import Image from "next/image";
import { AddressModalProps } from "@/types/global";



import MobileIcon from "@/assets/icons/callIcon.png";
import StateIcon from "@/assets/icons/mobileIcon.png";
import CityIcon from "@/assets/icons/callIcon.png";

import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  currentAddress,
}: AddressModalProps) {
  const [address, setAddress] = useState({
    country: currentAddress?.country || "",
    fullName: currentAddress?.fullName || "",
    mobile: currentAddress?.mobile || "",
    state: currentAddress?.state || "",
    city: currentAddress?.city || "",
    zip: currentAddress?.zip || "",
    street: currentAddress?.street || "",
    defaultAddress: currentAddress?.defaultAddress || false,
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (
    field: keyof typeof address,
    value: string | boolean
  ) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(address);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex h-dvh items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-157.25 w-full h-fit max-h-166 relative overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h2 className="font-MontserratSemiBold text-c16 mb-c32">
              Update Address
            </h2>

            <div className="flex flex-col gap-3">
              {/* Country / Region - full width */}

              <div className="w-full flex gap-c24 justify-between">
                <div className="flex flex-col gap-2 relative w-full">
                  <Label className="text-c12 font-MontserratMedium">
                    Country/Region
                  </Label>
                  <div className="relative w-full flex items-center">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Image
                        src={NigerianFlag}
                        alt="Country"
                        width={18}
                        height={18}
                        className="rounded-full"
                      />
                    </div>
                    <Input
                      type="text"
                      value={address.country}
                      placeholder="Nigeria"
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="border border-efefef rounded-c8 p-4 pl-10 w-full text-c12 font-MontserratMedium"
                    />
                  </div>
                </div>
                <div className="w-full h-8 bg-red"></div>
              </div>

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-c24 text-000000">
                  Contact information
                </p>
                <div className="flex gap-c24 w-full">
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Full Name
                    </Label>
                    <div className="relative w-full flex items-center">
                      <Input
                        type="text"
                        value={address.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        placeholder="Nigeria"
                        className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Mobile Number
                    </Label>
                    <div className="relative w-full flex items-center">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Image
                          src={MobileIcon}
                          alt="Mobile Number"
                          width={15.62}
                          height={15.62}
                        />
                      </div>
                      <Input
                        type="text"
                        value={address.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        placeholder="+2347058675432"
                        className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-c24 text-000000">
                  Address information
                </p>
                <div className="flex flex-col gap-c24">
                  <div className="flex gap-c24 w-full">
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        State / Province
                      </Label>
                      <div className="relative w-full flex items-center">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Image
                            src={StateIcon}
                            alt="State"
                            width={11.25}
                            height={17.5}
                          />
                        </div>
                        <Input
                          type="text"
                          value={address.state}
                          onChange={(e) =>
                            handleChange("state", e.target.value)
                          }
                          placeholder="+234675845675"
                          className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        City
                      </Label>
                      <div className="relative w-full flex items-center">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Image
                            src={CityIcon}
                            alt="City"
                            width={15.32}
                            height={15.32}
                          />
                        </div>
                        <Input
                          type="text"
                          value={address.city}
                          placeholder="+234675845675"
                          onChange={(e) => handleChange("city", e.target.value)}
                          className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-c24 w-full">
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Zip Code
                      </Label>
                      <div className="relative w-full flex items-center">
                        <Input
                          type="text"
                          value={address.zip}
                          placeholder="+234675845675"
                          onChange={(e) => handleChange("zip", e.target.value)}
                          className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Street / House / Apartment / Unit
                      </Label>
                      <div className="relative w-full flex items-center">
                        <Input
                          type="text"
                          value={address.street}
                          onChange={(e) =>
                            handleChange("street", e.target.value)
                          }
                          placeholder="frankubi2023@gmail.com"
                          className="border border-efefef rounded-c8 p-4 pl-10 w-full text-c12 font-MontserratMedium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-c16">
              
                <button
                  type="button"
                  onClick={() =>
                    handleChange("defaultAddress", !address.defaultAddress)
                  }
                  className={`w-c46 h-6 rounded-full transition-colors duration-300 ${
                    address.defaultAddress ? "bg-ff715b" : "bg-gray-300"
                  } relative`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full circled-shadow transition-all ${
                      address.defaultAddress
                        ? "translate-x-[22px]"
                        : "translate-x-0"
                    }`}
                  />
                </button>
                  <span className="text-c12 font-MontserratMedium">
                  Set as default address
                </span>
              </div>
            </div>

            <div className="w-full flex justify-end mt-c32">
              <Button
                onClick={handleSave}
                className="w-full max-w-50.5 bg-ff715b text-white flex justify-center items-center"
              >
                Save Address
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

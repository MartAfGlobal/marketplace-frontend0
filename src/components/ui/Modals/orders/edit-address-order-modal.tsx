"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../../forms/Label";
import { Input } from "../../forms/Input";
import Image from "next/image";
import { AddressModalProps, OrderAddress } from "@/types/global";

import MobileIcon from "@/assets/icons/callIcon.png";
import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useHttp } from "@/hooks/use-http";
import { LoadingSpinner } from "../../loading-spinner";
import CountryStateDropdown from "../../forms/CountryStateDropdown";
import UserCountryStateDropdown from "../../forms/userCountryStateDropdown";
import { useFetchOrders } from "@/helpers/fetchOrders";

export default function OrderEditAddressModal({
  isOpen,
  onClose,
  currentAddress,
  id,
}: AddressModalProps) {
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses
  );
  const { orders } = useSelector((state: any) => state.orders);
  const order = orders?.find((o: any) => o.id === id) || null;

  console.log("oorder id", order);

  const addressId =
    order?.shipping_address?.id ?? order?.shipping_address ?? null;

  // 3️⃣ Find the matching buyer saved address
  const address = buyerAddresses?.find((ad) => ad.id === addressId) || null;

  const [formData, setFormData] = useState<OrderAddress>({
    id: id || null,
    country: currentAddress?.country || "Nigeria",
    first_name: "",
    last_name: "",
    phone: "",
    state: "",
    city: "",
    postal_code: "",
    address: "",
    is_default: false,
  });

  useEffect(() => {
    if (!order || !address) return;

    setFormData({
      id: order.id || null,
      country: address.country || "",
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      phone: address.phone || "",
      state: address.state || "",
      city: address.city || "",
      postal_code: address.postal_code || "",
      address: address.address || "",
      is_default: address.is_default || false,
    });
  }, [order, address]);

  const { fetchOrders } = useFetchOrders();
  const token = useSelector((state: RootState) => state.token.token);
  const { loading, sendHttpRequest: saveRequest } = useHttp();
  const [streetError, setStreetError] = useState("");
  // Set default country (Nigeria) when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const nigeria = "Nigeria";

    setFormData((prev) => ({
      ...prev,
      country:
        address?.country && address.country.trim() !== ""
          ? address.country
          : nigeria,
    }));
  }, [isOpen, address]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (field: keyof OrderAddress, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const SaveSuccess = (res: any) => {
    console.log("address INFO:", res);
    fetchOrders();
    setStreetError("");
    onClose();
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    const { id, ...shipping_address } = formData;

    saveRequest({
      requestConfig: {
        url: `orders/${formData.id}/edit-shipping-address/`,
        method: "PATCH",
        body: { shipping_address },
        token: token ?? undefined,
        isAuth: true,
        successMessage: "Address updated successfully!",
        userType: "buyer",
      },
      successRes: SaveSuccess,
    });
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
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h2 className="font-MontserratSemiBold text-c16 mb-c24">
              Update Address
            </h2>

            <div className="flex flex-col gap-3">
              {/* Custom Country/State Dropdown */}
              <UserCountryStateDropdown
                country={formData.country}
                state={formData.state}
                onChange={handleChange}
              />

              {/* Contact Information */}
              <div>
                <p className="font-MontserratSemiBold text-c12 mb-3 text-000000">
                  Contact information
                </p>
                <div className="flex gap-c24 w-full">
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleChange("first_name", e.target.value)
                      }
                      placeholder="John Doe"
                      className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      last Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleChange("last_name", e.target.value)
                      }
                      placeholder="John Doe"
                      className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                    />
                  </div>
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
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+2347058675432"
                    className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                  />
                </div>
              </div>
              {/* Address Information */}
              <div>
                <p className="font-MontserratSemiBold text-c12 mb-3 text-000000">
                  Address information
                </p>
                <div className="flex flex-col gap-c24">
                  <div className="flex gap-c24 w-full">
                    {/* City */}
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        City
                      </Label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        placeholder="Lagos"
                        className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                      />
                    </div>

                    {/* Zip Code */}
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) =>
                          handleChange("postal_code", e.target.value)
                        }
                        placeholder="100001"
                        className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>

                  {/* Street */}
                  <div className="flex gap-c24 w-full">
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Street / House / Apartment / Unit
                      </Label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        placeholder="12 Broad Street"
                        className={`border rounded-c8 p-4 pl-10 w-full text-c12 font-MontserratMedium ${
                          streetError ? "border-red-500" : "border-efefef"
                        }`}
                      />
                      {streetError && (
                        <p className="text-red-500 text-xs mt-1">
                          {streetError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mt-c24">
              <Button
                disabled={loading}
                onClick={handleSave}
                className="w-full max-w-50.5 bg-ff715b text-white flex justify-center items-center"
              >
                {loading ? <LoadingSpinner /> : "Save Address"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

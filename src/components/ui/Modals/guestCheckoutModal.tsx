"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import Image from "next/image";
import {
  AddressModalProps,
  Address,
  GuestCheckoutAddress,
  CheckOutModalProps,
} from "@/types/global";

import MobileIcon from "@/assets/icons/callIcon.png";
import StateIcon from "@/assets/icons/mobileIcon.png";
import CityIcon from "@/assets/icons/callIcon.png";

import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// country-state-city
import { Country, State } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";
import CountryStateDropdown from "../forms/CountryStateDropdown";
import { RootState } from "@/store";
// token read from Redux store

// helper: map ISO code to flag URL
const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

export default function GuestCheckoutModal({
  isOpen,
  onClose,

  selectedItems,
  currentAddress,
}: CheckOutModalProps) {
  const [formData, setFormData] = useState<GuestCheckoutAddress>({
    guest_email: "",
    guest_phone: "",
    guest_address_line1: "",
    guest_address_line2: "",
    guest_city: "",
    guest_state: "",
    guest_postal_code: "",
    guest_country: currentAddress?.guest_country || "Nigeria",
    shipping_cost: 0,
    discount_amount: 0,
  });

  const router = useRouter();

  const [streetError, setStreetError] = useState("");

  const [states, setStates] = useState<any[]>([]);
  const [flag, setFlag] = useState<string>(NigerianFlag.src);
  // const tokenSlice = useSelector((state: any) => state.token);
  // const { token } = tokenSlice;
  const token = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    console.log("Selected Items in Guest Checkout Modal:", selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === formData.guest_country
    );

    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      setFlag(getFlagUrl(selectedCountry.isoCode));
    }
  }, [formData.guest_country]);

  const handleChange = (
    field: keyof GuestCheckoutAddress,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { loading, sendHttpRequest: saveRequest } = useHttp();

  const SaveSuccess = (res: any) => {
    console.log("address INFO:", res);

    setStreetError("");

    return;
  };
  const invalidForm =
    !formData.guest_country?.trim() ||
    !formData.guest_address_line1?.trim() ||
    !formData.guest_city?.trim() ||
    !formData.guest_email?.trim() ||
    !formData.guest_postal_code?.trim() ||
    !formData.guest_phone?.trim() ||
    !formData.guest_state?.trim();

  const handleCheckout = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.guest_address_line1?.trim()) {
      setStreetError("House number and street address are required.");
      return;
    } else {
      setStreetError("");
    }

    formData;

    const items = selectedItems?.map((item) => ({
      product_id: item.product_id,
      variation_id: item.variations?.[0]?.id || null, // optional, if your backend supports it
      quantity: item.quantity || 1, // fallback to 1
    }));

    console.log("Items on Checkout:", items);

    console.log("Form Data on Checkout:", formData);
    // Login request
    saveRequest({
      requestConfig: {
        url: "/checkout/",
        method: "POST",
        body: { ...formData, items },
        successMessage: "Redirecting to payment gateway...",
      },
      successRes: (res) => {
        console.log("respons data:", res.data);

        if (res.data?.paystack_payment_url) {
          window.location.href = res.data.paystack_payment_url;
          onClose?.();
        } else {
          // Fallback: navigate to your summary page
          return;
        }
      },
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
            {/* Close Button */}
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
              {/* Country / Region */}
              <CountryStateDropdown
                country={formData.guest_country}
                state={formData.guest_state}
                onChange={handleChange}
              />

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-3  text-000000">
                  Contact information
                </p>
                <div className="flex gap-c24 w-full">
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.guest_email}
                      onChange={(e) =>
                        handleChange("guest_email", e.target.value)
                      }
                      placeholder="truthokoye@gamil.com"
                      className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                    />
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
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.guest_phone}
                        onChange={(e) =>
                          handleChange("guest_phone", e.target.value)
                        }
                        placeholder="+2347058675432"
                        className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                        value={formData.guest_city}
                        placeholder="Lagos"
                        onChange={(e) =>
                          handleChange("guest_city", e.target.value)
                        }
                        className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                      />
                    </div>

                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        value={formData.guest_postal_code}
                        onChange={(e) =>
                          handleChange("guest_postal_code", e.target.value)
                        }
                        placeholder="100001"
                        className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-c24 w-full">
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Street / House / Apartment / Unit
                      </Label>
                      <Input
                        type="text"
                        value={formData.guest_address_line1}
                        onChange={(e) =>
                          handleChange("guest_address_line1", e.target.value)
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
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="guest_address_line2"
                        name="guest_address_line2"
                        type="text"
                        value={formData.guest_address_line2}
                        onChange={(e) =>
                          handleChange("guest_address_line2", e.target.value)
                        }
                        placeholder="12 Broad Street"
                        className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mt-c24">
              <Button
                disabled={loading || invalidForm}
                onClick={handleCheckout}
                className="w-full max-w-50.5 bg-ff715b text-white flex justify-center items-center"
              >
                {loading ? <LoadingSpinner /> : "Checkout"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

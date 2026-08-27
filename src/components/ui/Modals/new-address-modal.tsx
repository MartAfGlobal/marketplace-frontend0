"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import Image from "next/image";
import { AddressModalProps, Address } from "@/types/global";

import MobileIcon from "@/assets/icons/callIcon.png";
import StateIcon from "@/assets/icons/mobileIcon.png";
import CityIcon from "@/assets/icons/callIcon.png";

import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { RootState } from "@/store";

// country-state-city
import { Country, State } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";

import {
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "../forms/CountryStateDropdown";

import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

// helper: map ISO code to flag URL
const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  isEdit,
  currentAddress,
  id,
}: AddressModalProps) {
  const [formData, setFormData] = useState<Address>({
    id: currentAddress?.id || id || "",
    country: currentAddress?.country || "",
    first_name: currentAddress?.first_name || "",
    last_name: currentAddress?.last_name || "",
    phone: currentAddress?.phone || "",
    state: currentAddress?.state || "",
    city: currentAddress?.city || "",
    postal_code: currentAddress?.postal_code || "",
    address: currentAddress?.address || "",
    shipping_location: currentAddress?.shipping_location || "",
    is_default: currentAddress?.is_default || false,
  });
  const selectedCountryIdRef = useRef<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      if (currentAddress) {
        setFormData({
          id: currentAddress.id || id || "",
          country: currentAddress.country || "",
          first_name: currentAddress.first_name || "",
          last_name: currentAddress.last_name || "",
          phone: currentAddress.phone || "",
          state: currentAddress.state || "",
          city: currentAddress.city || "",
          postal_code: currentAddress.postal_code || "",
          address: currentAddress.address || "",
          shipping_location: currentAddress.shipping_location || "",
          is_default: currentAddress.is_default || false,
        });
      } else if (!isEdit) {
        setFormData({
          id: "",
          country: "",
          first_name: "",
          last_name: "",
          phone: "",
          state: "",
          city: "",
          postal_code: "",
          address: "",
          shipping_location: "",
          is_default: false,
        });
      }
    }
  }, [isOpen, currentAddress, isEdit, id]);

  const [streetError, setStreetError] = useState("");

  const [states, setStates] = useState<any[]>([]);
  const [flag, setFlag] = useState<string>(NigerianFlag.src);
  const token = useSelector((state: RootState) => state.token.token);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Update states when country changes
  useEffect(() => {
    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === formData.country,
    );

    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      setFlag(getFlagUrl(selectedCountry.isoCode));
    }
  }, [formData.country]);

  const handleChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDropdownChange = (field: string, value: string | undefined) => {
    if (field === "guest_country_id") {
      selectedCountryIdRef.current = value ?? null;
      return;
    }

    setFormData((prev) => {
      switch (field) {
        case "guest_country":
          return {
            ...prev,
            country: value ?? "",
            state: "",
            city: "",
            shipping_location: "",
          };

        case "guest_state":
          return {
            ...prev,
            state: value ?? "",
            city: "",
            shipping_location: "",
          };

        case "guest_city":
          return {
            ...prev,
            city: value ?? "",
          };

        case "guest_location_id":
          return {
            ...prev,
            shipping_location: value ?? "",
          };

        default:
          return prev;
      }
    });
  };

  const { loading, sendHttpRequest: saveRequest } = useHttp();

  const SaveSuccess = (res: any) => {
    console.log("address INFO:", res);
    dispatch(buyerActions.addBuyerAddress(res.data));

    setStreetError("");
    onSave?.(formData);
    onClose();

    return;
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();

    const { id, ...bodyWithoutId } = formData;

    const payload = {
      ...bodyWithoutId,
      country: selectedCountryIdRef.current, // ✅ send ID instead of name
    };

    console.log("Token in handleSave:", bodyWithoutId);
    saveRequest({
      requestConfig: {
        url: "/shipping/shipping-addresses/",
        method: "POST",
        body: payload,
        token: token ?? undefined,
        isAuth: true,
        userType: "buyer",
        successMessage: "address added successful!",
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

            {isEdit ? (
              <h2 className="font-MontserratSemiBold text-c16 mb-c24">
                Update Address
              </h2>
            ) : (
              <h2 className="font-MontserratSemiBold text-c16 mb-c24">
                Add new Address
              </h2>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-c24 w-full ">
                <CountryDropdown
                  country={formData.country}
                  onChange={handleDropdownChange}
                />
                <div className="w-full"></div>
              </div>

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
                      id="first_name"
                      name="first_name"
                      autoComplete="given-name"
                      type="text"
                      validateName={true}
                      value={formData.first_name}
                      onChange={(e) =>
                        handleChange(
                          "first_name",
                          e.target.value.replace(/[^a-zA-Z]/g, "")
                        )
                      }
                      placeholder="John"
                      className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      autoComplete="family-name"
                      type="text"
                      validateName={true}
                      value={formData.last_name}
                      onChange={(e) =>
                        handleChange(
                          "last_name",
                          e.target.value.replace(/[^a-zA-Z]/g, "")
                        )
                      }
                      placeholder="Doe"
                      className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 relative w-1/2 mt-4">
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
                      autoComplete="tel"
                      type="tel"
                      validatePhone={true}
                      value={formData.phone}
                      onChange={(e) =>
                        handleChange("phone", e.target.value.replace(/[^0-9+]/g, ""))
                      }
                      placeholder="+2347058675432"
                      className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-3 text-000000">
                  Address information
                </p>
                <div className="flex flex-col gap-c24">
                  <div className="flex gap-c24 w-full">
                    <StateDropdown
                      state={formData.state}
                      onChange={handleDropdownChange}
                    />
                    <div className="flex flex-col gap-2 w-full">
                      <CityDropdown
                        city={formData.city}
                        onChange={handleDropdownChange}
                      />
                    </div>
                  </div>

                  <div className="flex gap-c24 w-full">
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Zip Code
                      </Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        autoComplete="postal-code"
                        type="text"
                        validateDigits={true}
                        value={formData.postal_code}
                        onChange={(e) =>
                          handleChange("postal_code", e.target.value.replace(/[^0-9]/g, ""))
                        }
                        placeholder="100001"
                        className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                      />
                    </div>

                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Street / House / Apartment / Unit
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        autoComplete="street-address"
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

              <div className="flex items-center gap-3 mt-c16">
                <button
                  type="button"
                  onClick={() =>
                    handleChange("is_default", !formData.is_default)
                  }
                  className={`w-c46 h-6 rounded-full transition-colors duration-300 ${
                    formData.is_default ? "bg-ff715b" : "bg-gray-300"
                  } relative`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full circled-shadow transition-all ${
                      formData.is_default
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

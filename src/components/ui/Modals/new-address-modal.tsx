"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import Image from "next/image";
import { AddressModalProps, Address} from "@/types/global";

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

// helper: map ISO code to flag URL
const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  currentAddress,
}: AddressModalProps) {
  const [formData, setFormData] = useState<Address>({
    id: 0,
    country: currentAddress?.country || "Nigeria",
    full_name: "",
    phone: "",
    state: "",
    city: "",
    postal_code: "",
    address: "",
    is_default: false,
  });

  const router = useRouter();

  const [streetError, setStreetError] = useState("");

  const [states, setStates] = useState<any[]>([]);
  const [flag, setFlag] = useState<string>(NigerianFlag.src);
  const tokenSlice = useSelector((state: any) => state.token);
  const { token } = tokenSlice;


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
      (c) => c.name === formData.country
    );

    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      setFlag(getFlagUrl(selectedCountry.isoCode));
    }
  }, [formData.country]);

  const handleChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { loading, sendHttpRequest: saveRequest } = useHttp();

  const SaveSuccess = (res: any) => {
    console.log("address INFO:", res);

    setStreetError("");
    onSave(formData);
    onClose();

    return;
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();

    console.log("Token in handleSave:", token);
    const { id, ...bodyWithoutId } = formData;

    // Login request
    saveRequest({
      requestConfig: {
        url: "shipping/shipping-addresses/",
        method: "POST",
        body: bodyWithoutId,

        token,
        isAuth: true,
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
              <div className="w-full flex gap-c24 justify-between">
                <div className="flex flex-col gap-2 relative w-full max-w-67.5">
                  <Label className="text-c12 font-MontserratMedium">
                    Country/Region
                  </Label>
                  <div className="relative w-full flex items-center rounded-c8 p-4 border border-efefef ">
                    {flag && (
                      <div className="absolute  left-3 top-1/2 -translate-y-1/2">
                        <Image
                          src={flag}
                          alt="Country"
                          width={18}
                          height={18}
                          className="rounded-full h-4.5 w-4.5"
                        />
                      </div>
                    )}
                    <select
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      className="  pl-5  focus:ring-0 focus:outline-0 w-full text-c12 font-MontserratMedium"
                    >
                      {Country.getAllCountries().map((c) => (
                        <option
                          className="-ml-12"
                          key={c.isoCode}
                          value={c.name}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-3  text-000000">
                  Contact information
                </p>
                <div className="flex gap-c24 w-full">
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Full Name
                    </Label>
                    <Input
                      id="full_namw"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleChange("full_name", e.target.value)
                      }
                      placeholder="John Doe"
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
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
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
                    {/* State */}
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        State / Province
                      </Label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                      >
                        <option value="">Select State</option>
                        {states.map((s) => (
                          <option key={s.isoCode} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        City
                      </Label>
                      <Input
                        type="text"
                        value={formData.city}
                        placeholder="Lagos"
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="border border-efefef rounded-c8 p-4 w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-c24 w-full">
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
                        className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                      />
                    </div>

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

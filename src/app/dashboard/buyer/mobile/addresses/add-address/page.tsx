"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Flag from "@/assets/icons/flag.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import Phone from "@/assets/mobile/Phone.png";
import CaretDown from "@/assets/mobile/carent-down.png";
import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";

import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { Country, State } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";

import { Address } from "@/types/global";
import { RootState } from "@/store";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "@/components/ui/forms/CountryStateDropdown";

// Helper to close dropdowns on outside click
function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onOutside]);
  return ref;
}

// Helper: map ISO code to flag URL
const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

export default function AddNewAddreess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token.token);

  const [formData, setFormData] = useState<Address>({
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

  const [countries, setCountries] = useState(Country.getAllCountries());
  const [selectedCountry, setSelectedCountry] = useState<
    (typeof countries)[number] | null
  >(null);
  const selectedCountryIdRef = useRef<string | null>(null);

  const [states, setStates] = useState(State.getStatesOfCountry("NG"));
  const [selectedState, setSelectedState] = useState<
    (typeof states)[number] | null
  >(null);

  const [flag, setFlag] = useState<string>(NigerianFlag.src);
  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const PHONE_REGEX = /^[0-9+\-\s().]*$/;

  const validatePhone = (val: string) => {
    if (!val || val.trim() === "") { setPhoneError(""); return; }
    if (!PHONE_REGEX.test(val)) {
      setPhoneError("Phone number must contain only digits, +");
    } else {
      setPhoneError("");
    }
  };

  const countryRef = useClickOutside<HTMLDivElement>(() =>
    setCountryOpen(false),
  );
  const stateRef = useClickOutside<HTMLDivElement>(() => setStateOpen(false));

  const { loading, sendHttpRequest } = useHttp();

  useEffect(() => {
    const allCountries = Country.getAllCountries();

    // Find Nigeria
    const nigeria = allCountries.find((c) => c.isoCode === "NG");

    // Put Nigeria first, then the rest
    const sortedCountries = nigeria
      ? [nigeria, ...allCountries.filter((c) => c.isoCode !== "NG")]
      : allCountries;

    setCountries(sortedCountries);
    setSelectedCountry(nigeria || sortedCountries[0]);
    setFlag(getFlagUrl((nigeria || sortedCountries[0]).isoCode));

    setFormData((prev) => ({
      ...prev,
      country: (nigeria || sortedCountries[0]).name,
      phone: "+" + (nigeria || sortedCountries[0]).phonecode + " ",
    }));
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(countryStates);
    setSelectedState(null);
  }, [selectedCountry]);

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

  useEffect(() => {
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      router.replace(isMobile ? "/?showLogin=true" : "/auth/login");
    }
  }, [token, router]);

  const SaveSuccess = (res: any) => {
    console.log("address INFO:", res);
    dispatch(buyerActions.addBuyerAddress(res.data));
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
    sendHttpRequest({
      requestConfig: {
        url: "/shipping/shipping-addresses/",
        method: "PATCH",
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
    <div>
      <div className="px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3 md:mt-c32"
        >
          <Image
            src={NavBack}
            alt="<"
            width={9}
            height={16.5}
            className="brightness-20 w-2.25 h-[16.5px]"
          />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Add new address
          </p>
        </button>
      </div>

      <div className="px-6 pt-7 pb-30">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Country dropdown */}
          <CountryDropdown
            country={formData.country}
            onChange={handleDropdownChange}
          />

          {/* Contact info */}
          <div>
            <p className="text-sm font-MontserratSemiBold pb-4">
              Contact information
            </p>
            <div className="pb-3">
              <Label className="text-sm font-MontserratSemiBold">
                First name
              </Label>
              <input
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value.replace(/[^a-zA-Z]/g, ""))}
              />
            </div>
            <div className="pb-3">
              <Label className="text-sm font-MontserratSemiBold">
                Last name
              </Label>
              <input
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value.replace(/[^a-zA-Z]/g, ""))}
              />
            </div>

            <div>
              <Label className="text-sm font-MontserratSemiBold">
                Mobile number
              </Label>
            
              <div
                className="flex items-center p-4 mt-2 rounded-lg h-10"
                style={{ border: `1px solid ${phoneTouched && phoneError ? "#CA0202" : "#d1d5db"}` }}
              >
                <Image
                  src={Phone}
                  alt="phone"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <input
                  type="tel"
                  className="w-full outline-none"
                  value={formData.phone}
                  onChange={(e) => {
                    if (phoneTouched) validatePhone(e.target.value);
                    handleChange("phone", e.target.value);
                  }}
                  onBlur={(e) => {
                    setPhoneTouched(true);
                    validatePhone(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Address info */}
          <div>
            <p className="text-sm font-MontserratSemiBold pb-4">
              Address information
            </p>
            <div className="pb-3">
              <Label className="text-sm font-MontserratSemiBold">
                Street, house, apartment, unit
              </Label>
              <input
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <StateDropdown
              state={formData.state}
              onChange={handleDropdownChange}
            />

            {/* City dropdown */}
            <div className="space-y-4 pt-3 mb-1">
              <CityDropdown
                city={formData.city}
                onChange={handleDropdownChange}
              />
            </div>

            <div className="pb-3">
              <Label className="text-sm font-MontserratSemiBold">
                Postal code
              </Label>
              <input
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                value={formData.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
              />
            </div>

            <div className="pt-6 flex items-center justify-between">
              <span className="text-c2 font-MontserratSemiBold">
                Set as default address
              </span>
              <button
                type="button"
                onClick={() => setIsDefault((v) => !v)}
                aria-pressed={isDefault}
                className="relative inline-flex items-center rounded-full transition-colors"
                style={{
                  width: 46,
                  height: 24,
                  backgroundColor: isDefault ? "#FF715B" : "#E5E7EB",
                }}
              >
                <span
                  className="inline-block rounded-full bg-white shadow transition-transform"
                  style={{
                    width: 20,
                    height: 20,
                    transform: `translateX(${isDefault ? 24 : 4}px)`,
                  }}
                />
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
            <Button type="submit" className="border-0">
              {loading ? <LoadingSpinner /> : "Save address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

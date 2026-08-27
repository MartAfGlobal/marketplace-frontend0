"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Flag from "@/assets/icons/flag.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import Phone from "@/assets/mobile/Phone.png";
import CaretDown from "@/assets/mobile/carent-down.png";
import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";

import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { Country, State, City } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";

import { GuestCheckoutAddress, CheckOutModalProps } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { selectCheckedItems, setCheckoutSummary } from "@/store/cart/cartSlice";
import { RootState } from "@/store";
import {
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "@/components/ui/forms/CountryStateDropdown";

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

  const searchParams = useSearchParams();

  const isEditing = searchParams.get("editing") === "true";
  const selectedItems = useSelector(selectCheckedItems);

  const checkoutSummary = useSelector(
    (state: RootState) => state.cart.checkoutSummary,
  );

  const currentAddress = checkoutSummary?.guest_address;

  const checkoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems,
  );

  useEffect(() => {
    console.log("Selected Items in Guest:", selectedItems);
  }, [selectedItems]);
  const [formData, setFormData] = useState<GuestCheckoutAddress>({
    shipping_location_id: currentAddress?.shipping_location_id || "",
    guest_first_name: currentAddress?.guest_first_name || "",
    guest_last_name: currentAddress?.guest_last_name || "",
    guest_email: currentAddress?.guest_email || "",
    guest_phone: currentAddress?.guest_phone || "",
    guest_shipping_address: {
      line1: currentAddress?.guest_shipping_address?.line1 || "",
      line2: currentAddress?.guest_shipping_address?.line2 || "",
      city: currentAddress?.guest_shipping_address?.city || "",
      state: currentAddress?.guest_shipping_address?.state || "",
      postal_code: currentAddress?.guest_shipping_address?.postal_code || "",
      country: currentAddress?.guest_shipping_address?.country || "Nigeria",
    },
    discount_amount: currentAddress?.discount_amount || "0.00",
  });

  const [countries, setCountries] = useState<
    ReturnType<typeof Country.getAllCountries>
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<
    ReturnType<typeof Country.getAllCountries>[number] | null
  >(null);

  const [states, setStates] = useState<
    ReturnType<typeof State.getStatesOfCountry>
  >([]);
  const [selectedState, setSelectedState] = useState<
    ReturnType<typeof State.getStatesOfCountry>[number] | null
  >(null);

  const [cities, setCities] = useState<
    ReturnType<typeof City.getCitiesOfState>
  >([]);
  const [selectedCity, setSelectedCity] = useState<
    ReturnType<typeof City.getCitiesOfState>[number] | null
  >(null);

  const [flag, setFlag] = useState<string>(NigerianFlag.src);

  // Dropdowns
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);
  const [streetError, setStreetError] = useState("");
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
  const dispatch = useDispatch();

  const countryRef = useClickOutside<HTMLDivElement>(() =>
    setCountryOpen(false),
  );
  const stateRef = useClickOutside<HTMLDivElement>(() => setStateOpen(false));
  const cityRef = useClickOutside<HTMLDivElement>(() => setCityOpen(false));

  const { loading, sendHttpRequest: saveRequest } = useHttp();

  const handleCheckout = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.guest_shipping_address.line1?.trim()) {
      setStreetError("House number and street address are required.");
      return;
    }

    console.log("checking formdata", formData);

    const items = checkoutItems.map((item) => ({
      product_id: item.id,
      variation_id: item.variation_id || null,
      quantity: item.quantity,
    }));

    saveRequest({
      requestConfig: {
        url: "/checkout/summary/guest/",
        method: "POST",
        body: { ...formData, items },
        successMessage: "Redirecting to summary page...",
      },
      successRes: (res) => {
        const data = res.data;
        console.log("respons data:", data);
        dispatch(
          setCheckoutSummary({
            all_addresses: data?.all_addresses ?? [],

            discount_amount: data?.discount_amount ?? "0.00",
            shipping_cost: data?.shipping_cost ?? "0.00",
            shipping_methods: checkoutSummary?.shipping_methods ?? [],

            subtotal: data?.subtotal ?? "0.00",
            total: data?.total ?? "0.00",

            guest_address: {
              ...formData,
            },
          }),
        );

        router.push("/cart/checkout");
      },
    });

    setStreetError("");
  };

  const handleChange = (field: string, value: string | undefined) => {
    // map dropdown fields to form structure
    if (field === "guest_country") {
      setFormData((prev) => ({
        ...prev,
        guest_shipping_address: {
          ...prev.guest_shipping_address,
          country: value ?? "",
          state: "",
          city: "",
        },
        shipping_location_id: "",
      }));
      return;
    }

    if (field === "guest_state") {
      setFormData((prev) => ({
        ...prev,
        guest_shipping_address: {
          ...prev.guest_shipping_address,
          state: value ?? "",
          city: "",
        },
        shipping_location_id: "",
      }));
      return;
    }

    if (field === "guest_city") {
      setFormData((prev) => ({
        ...prev,
        guest_shipping_address: {
          ...prev.guest_shipping_address,
          city: value ?? "",
        },
      }));
      return;
    }

    if (field === "guest_location_id") {
      setFormData((prev) => ({
        ...prev,
        shipping_location_id: value ?? "",
      }));
      return;
    }

    // normal inputs
    if (["line1", "line2", "postal_code"].includes(field)) {
      setFormData((prev) => ({
        ...prev,
        guest_shipping_address: {
          ...prev.guest_shipping_address,
          [field]: value ?? "",
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value ?? "",
    }));
  };
  const handleCountrySelect = (c: typeof selectedCountry) => {
    if (!c) return;
    setSelectedCountry(c);
    setFlag(getFlagUrl(c.isoCode));
    setSelectedState(null);
    setSelectedCity(null);
    setCountryOpen(false);
    setFormData((prev) => ({
      ...prev,
      country: c.name,
      phone: "+" + c.phonecode + " ",
      state: "",
      city: "",
      postal_code: "",
    }));
  };

  const handleStateSelect = (s: typeof selectedState) => {
    if (!s) return;
    setSelectedState(s);
    setSelectedCity(null);
    setStateOpen(false);
    setFormData((prev) => ({
      ...prev,
      state: s.name,
      city: "",
      postal_code: "",
    }));
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const invalidForm =
    !formData.shipping_location_id?.trim() ||
    !formData.guest_first_name?.trim() ||
    !formData.guest_last_name?.trim() ||
    !formData.guest_shipping_address.country?.trim() ||
    !formData.guest_shipping_address.line1?.trim() ||
    !formData.guest_shipping_address.city?.trim() ||
    !formData.guest_shipping_address.postal_code?.trim() ||
    !formData.guest_shipping_address.state?.trim() ||
    !formData.guest_phone?.trim() ||
    !formData.guest_email?.trim();

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
            {isEditing ? "Edit address" : "Add new address"}
          </p>
        </button>
      </div>

      <div className="px-6 pt-7 pb-30">
        <form onSubmit={handleCheckout}>
          <fieldset className="space-y-6">
            <CountryDropdown
              country={formData.guest_shipping_address.country}
              onChange={handleChange}
            />
            <div>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  First Name
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_first_name}
                  onChange={(e) =>
                    handleChange("guest_first_name", e.target.value.replace(/[^a-zA-Z]/g, ""))
                  }
                />
              </div>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Last Name
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_last_name}
                  onChange={(e) => handleChange("guest_last_name", e.target.value.replace(/[^a-zA-Z]/g, ""))}
                />
              </div>
            </div>

            {/* Contact info */}
            <div>
              <p className="text-sm font-MontserratSemiBold pb-4">
                Contact information
              </p>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  email address
                </Label>
                <input
                  type="email"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_email}
                  onChange={(e) => handleChange("guest_email", e.target.value)}
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
                    value={formData.guest_phone}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^0-9+]/g, "");
                      if (phoneTouched) validatePhone(sanitized);
                      handleChange("guest_phone", sanitized);
                    }}
                    onBlur={(e) => {
                      setPhoneTouched(true);
                      validatePhone(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-MontserratSemiBold pb-4">
                Address information
              </p>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Street, house, apartment, unit (address line 1 required)
                </Label>
                <input
                  type="text"
                  className={`w-full p-4 mt-2 border border-gray-300 rounded-lg h-10 ${
                    streetError ? "border-red-500" : "border-efefef"
                  }`}
                  value={formData.guest_shipping_address.line1}
                  onChange={(e) => handleChange("line1", e.target.value)}
                />
              </div>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Street, house, apartment, unit (address line 2 optional)
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_shipping_address.line2}
                  onChange={(e) => handleChange("line2", e.target.value)}
                />
              </div>

              <StateDropdown
                state={formData.guest_shipping_address.state}
                onChange={handleChange}
              />

              <div>
                <CityDropdown
                city={formData.guest_shipping_address.city}
                onChange={handleChange}
              />
              </div>

              

              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Postal code
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_shipping_address.postal_code}
                  onChange={(e) =>
                    handleChange("postal_code", e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
            </div>

            <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
              <Button
                disabled={invalidForm || loading}
                type="submit"
                className="border-0"
              >
                {loading ? <LoadingSpinner /> : "continue to payment"}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

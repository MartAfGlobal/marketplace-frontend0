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
import { Country, State, City } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { useSelector } from "react-redux";

import { GuestCheckoutAddress, CheckOutModalProps } from "@/types/global";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { selectCheckedItems } from "@/store/cart/cartSlice";

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
  const currentAddress = null;

  const selectedItems = useSelector(selectCheckedItems);

  useEffect(() => {
    console.log("Selected Items in Guest:", selectedItems);
  }, [selectedItems]);
  const [formData, setFormData] = useState<GuestCheckoutAddress>({
    first_name: "",
    last_name: "",
    guest_email: "",
    guest_phone: "",
    guest_address_line1: "",
    guest_address_line2: "",
    guest_city: "",
    guest_state: "",
    guest_postal_code: "",
    guest_country: "Nigeria",
    shipping_cost: 0,
    discount_amount: 0,
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

  const countryRef = useClickOutside<HTMLDivElement>(() =>
    setCountryOpen(false)
  );
  const stateRef = useClickOutside<HTMLDivElement>(() => setStateOpen(false));
  const cityRef = useClickOutside<HTMLDivElement>(() => setCityOpen(false));

  const { loading, sendHttpRequest: saveRequest } = useHttp();

  const handleCheckout = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.guest_address_line1?.trim()) {
      setStreetError("House number and street address are required.");
      return;
    } else {
      setStreetError("");
    }

    formData;

    const items = selectedItems.map((item: any) => ({
      product_id: item.product_id,
      variation_id: item.variations?.[0]?.id || null,
      quantity: item.quantity || 1,
    }));

    console.log("Items on Checkout:", selectedItems);

    console.log("Form Data on Checkout:", formData);

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
        } else {
          return;
        }
      },
    });
  };

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    const defaultCountry =
      allCountries.find((c) => c.name === formData.guest_country) ||
      allCountries[0];
    setSelectedCountry(defaultCountry);
    setFlag(getFlagUrl(defaultCountry.isoCode));
    setFormData((prev) => ({
      ...prev,
      country: defaultCountry.name,
      phone: prev.guest_phone || "+" + defaultCountry.phonecode + " ",
    }));
  }, []);

  // Update states and cities when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(countryStates);
    const defaultState =
      countryStates.find((s) => s.name === formData.guest_state) || null;
    setSelectedState(defaultState);

    if (defaultState) {
      const stateCities = City.getCitiesOfState(
        selectedCountry.isoCode,
        defaultState.isoCode
      );
      setCities(stateCities);
      const defaultCity =
        stateCities.find((c) => c.name === formData.guest_city) || null;
      setSelectedCity(defaultCity);
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  // Update cities when state changes
  useEffect(() => {
    if (!selectedState || !selectedCountry) return;
    const stateCities = City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode
    );
    setCities(stateCities);
    const defaultCity =
      stateCities.find((c) => c.name === formData.guest_city) || null;
    setSelectedCity(defaultCity);
  }, [selectedState]);

  const handleChange = (
    field: keyof GuestCheckoutAddress,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleCitySelect = (c: typeof selectedCity) => {
    if (!c) return;
    setSelectedCity(c);
    setCityOpen(false);
    setFormData((prev) => ({
      ...prev,
      city: c.name,
      postal_code: formData.guest_postal_code || "",
    }));
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const invalidForm =
    !formData.first_name?.trim() ||
    !formData.last_name?.trim() ||
    !formData.guest_country?.trim() ||
    !formData.guest_address_line1?.trim() ||
    !formData.guest_city?.trim() ||
    !formData.guest_email?.trim() ||
    !formData.guest_postal_code?.trim() ||
    !formData.guest_phone?.trim() ||
    !formData.guest_state?.trim();

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
        <form onSubmit={handleCheckout}>
          <fieldset className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm pb-4 font-MontserratSemiBold">
                Country/region
              </Label>
              <div className="relative pt-4 w-full" ref={countryRef}>
                <button
                  type="button"
                  onClick={() => setCountryOpen((p) => !p)}
                  className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <Image src={flag} alt="flag" width={16} height={12} />
                    <span>{selectedCountry?.name || "Select country"}</span>
                  </div>
                  <Image
                    src={CaretDown}
                    alt="select country"
                    width={11}
                    height={6}
                  />
                </button>

                <AnimatePresence>
                  {countryOpen && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="absolute left-0 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 max-h-60 overflow-auto"
                    >
                      {countries.map((c) => (
                        <div
                          key={c.isoCode}
                          onClick={() => handleCountrySelect(c)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                          <Image
                            src={getFlagUrl(c.isoCode)}
                            alt={c.name}
                            width={16}
                            height={12}
                          />
                          <span>{c.name}</span>
                          <span className="ml-auto text-xs opacity-60">
                            +{c.phonecode}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  First Name
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                />
              </div>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Last Name
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
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
                <div className="flex items-center p-4 mt-2 border border-gray-300 rounded-lg h-10">
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
                    onChange={(e) =>
                      handleChange("guest_phone", e.target.value)
                    }
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
                  value={formData.guest_address_line1}
                  onChange={(e) =>
                    handleChange("guest_address_line1", e.target.value)
                  }
                />
              </div>
              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Street, house, apartment, unit (address line 2 required)
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_address_line2}
                  onChange={(e) =>
                    handleChange("guest_address_line2", e.target.value)
                  }
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-MontserratSemiBold">
                  State/province
                </Label>
                <div className="relative pt-2 w-full" ref={stateRef}>
                  <button
                    type="button"
                    onClick={() => setStateOpen((p) => !p)}
                    className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
                  >
                    <span>
                      {selectedState?.name || "Select state/province"}
                    </span>
                    <Image
                      src={CaretDown}
                      alt="select state"
                      width={11}
                      height={6}
                    />
                  </button>

                  <AnimatePresence>
                    {stateOpen && (
                      <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="absolute left-0 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 max-h-60 overflow-auto"
                      >
                        {states.map((s) => (
                          <div
                            key={s.isoCode}
                            onClick={() => handleStateSelect(s)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {s.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-4 pt-3">
                <Label className="text-sm font-MontserratSemiBold">City</Label>
                <div className="relative pt-2 w-full" ref={cityRef}>
                  <button
                    type="button"
                    onClick={() => setCityOpen((p) => !p)}
                    className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
                  >
                    <span>{selectedCity?.name || "Select city"}</span>
                    <Image
                      src={CaretDown}
                      alt="select city"
                      width={11}
                      height={6}
                    />
                  </button>

                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="absolute left-0 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 max-h-60 overflow-auto"
                      >
                        {cities.map((c) => (
                          <div
                            key={c.name}
                            onClick={() => handleCitySelect(c)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {c.name}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="pb-3">
                <Label className="text-sm font-MontserratSemiBold">
                  Postal code
                </Label>
                <input
                  type="text"
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                  value={formData.guest_postal_code}
                  onChange={(e) =>
                    handleChange("guest_postal_code", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
              <Button disabled={invalidForm || loading} type="submit" className="border-0">
                {loading ? <LoadingSpinner /> : "continue to payment"}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

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

import { AddressModalProps, Address } from "@/types/global";

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
  const tokenSlice = useSelector((state: any) => state.token);
  const { token } = tokenSlice;

  const [formData, setFormData] = useState<Address>({
    id: 0,
    country: "",
    full_name: "",
    phone: "",
    state: "",
    city: "",
    postal_code: "",
    address: "",
    is_default: false,
  });

  // Countries, States, Cities
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

  const [isDefault, setIsDefault] = useState<boolean>(formData.is_default);

  const countryRef = useClickOutside<HTMLDivElement>(() =>
    setCountryOpen(false)
  );
  const stateRef = useClickOutside<HTMLDivElement>(() => setStateOpen(false));
  const cityRef = useClickOutside<HTMLDivElement>(() => setCityOpen(false));

  const { loading, sendHttpRequest } = useHttp();

  // Load countries and set default
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    const defaultCountry =
      allCountries.find((c) => c.name === formData.country) || allCountries[0];
    setSelectedCountry(defaultCountry);
    setFlag(getFlagUrl(defaultCountry.isoCode));
    setFormData((prev) => ({
      ...prev,
      country: defaultCountry.name,
      phone: prev.phone || "+" + defaultCountry.phonecode + " ",
    }));
  }, []);

  // Update states and cities when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(countryStates);
    const defaultState =
      countryStates.find((s) => s.name === formData.state) || null;
    setSelectedState(defaultState);

    if (defaultState) {
      const stateCities = City.getCitiesOfState(
        selectedCountry.isoCode,
        defaultState.isoCode
      );
      setCities(stateCities);
      const defaultCity =
        stateCities.find((c) => c.name === formData.city) || null;
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
      stateCities.find((c) => c.name === formData.city) || null;
    setSelectedCity(defaultCity);
  }, [selectedState]);

  const handleChange = (field: keyof Address, value: string | boolean) => {
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
      postal_code: formData.postal_code || "",
    }));
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  useEffect(() => {
    if (!token) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        // Go to landing page and tell it to open login modal
        router.replace("/?showLogin=true");
      } else {
        // Desktop → go to dedicated login page
        router.replace("/auth/login");
      }
      return;
    }
  });

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    const { id, ...bodyWithoutId } = formData;

    sendHttpRequest({
      requestConfig: {
        url: "shipping/shipping-addresses/",
        method: "POST",
        body: bodyWithoutId,
        token,
        isAuth: true,
        successMessage: "Address added successfully!",
        userType: "buyer",
      },
      successRes: () => {
        router.back();
      },
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

          {/* Contact info */}
          <div>
            <p className="text-sm font-MontserratSemiBold pb-4">
              Contact information
            </p>
            <div className="pb-3">
              <Label className="text-sm font-MontserratSemiBold">
                Full name
              </Label>
              <input
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
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
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
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

            {/* State dropdown */}
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
                  <span>{selectedState?.name || "Select state/province"}</span>
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

            {/* City dropdown */}
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
              {loading ? "Saving..." : "Save address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

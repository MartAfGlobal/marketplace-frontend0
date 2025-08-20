"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Flag from "@/assets/icons/flag.svg";
import NavBack from "@/assets/icons/navBacksmall.png";
import Phone from "@/assets/mobile/Phone.png";
import CaretDown from "@/assets/mobile/carent-down.png";

import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";

/** ---- Simple Africa dataset (extend as needed) ---- */
type ZipEntry = string;
type City = { label: string; zips: ZipEntry[] };
type StateEntry = { label: string; cities: City[] };
type Country = {
  label: string;
  value: string;
  dialCode: string;
  // swap to your country flags here if you have them, otherwise fallback Flag
  flag?: any;
  states: StateEntry[];
};

const AFRICA: Country[] = [
  {
    label: "Nigeria",
    value: "ng",
    dialCode: "+234",
    flag: Flag,
    states: [
      {
        label: "Lagos",
        cities: [
          { label: "Ikeja", zips: ["100001", "100101"] },
          { label: "Lekki", zips: ["105102"] },
          { label: "Surulere", zips: ["101283"] },
        ],
      },
      {
        label: "Abuja (FCT)",
        cities: [
          { label: "Garki", zips: ["900001"] },
          { label: "Wuse", zips: ["900102"] },
          { label: "Maitama", zips: ["900271"] },
        ],
      },
      {
        label: "Rivers",
        cities: [{ label: "Port Harcourt", zips: ["500001", "500272"] }],
      },
    ],
  },
  {
    label: "Ghana",
    value: "gh",
    dialCode: "+233",
    flag: Flag,
    states: [
      {
        label: "Greater Accra",
        cities: [
          { label: "Accra", zips: ["00233"] },
          { label: "Tema", zips: ["00233"] },
        ],
      },
      { label: "Ashanti", cities: [{ label: "Kumasi", zips: ["AK-0000-0000"] }] },
    ],
  },
  {
    label: "Kenya",
    value: "ke",
    dialCode: "+254",
    flag: Flag,
    states: [
      { label: "Nairobi", cities: [{ label: "Nairobi", zips: ["00100", "00505"] }] },
      { label: "Mombasa", cities: [{ label: "Mombasa", zips: ["80100"] }] },
    ],
  },
  {
    label: "South Africa",
    value: "za",
    dialCode: "+27",
    flag: Flag,
    states: [
      { label: "Gauteng", cities: [{ label: "Johannesburg", zips: ["2000", "2001"] }] },
      { label: "Western Cape", cities: [{ label: "Cape Town", zips: ["8001", "8005"] }] },
    ],
  },
  {
    label: "Egypt",
    value: "eg",
    dialCode: "+20",
    flag: Flag,
    states: [
      { label: "Cairo", cities: [{ label: "Cairo", zips: ["11511", "11311"] }] },
      { label: "Giza", cities: [{ label: "Giza", zips: ["12511"] }] },
    ],
  },
];

/** ---- Small helper to close on outside click ---- */
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

export default function AddNewAddreess() {
  const router = useRouter();

  // Selections
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [zipOpen, setZipOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<Country>(AFRICA[0]); // default Nigeria
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedZip, setSelectedZip] = useState<string>("");

  // Phone handling
  const [phone, setPhone] = useState<string>(AFRICA[0].dialCode + " ");

  // Toggle (Set as default, etc.)
  const [isDefault, setIsDefault] = useState<boolean>(false);

  // Derived options
  const states = useMemo<StateEntry[]>(() => selectedCountry.states, [selectedCountry]);
  const cities = useMemo<City[]>(() => {
    const s = states.find((st) => st.label === selectedState);
    return s ? s.cities : [];
  }, [states, selectedState]);
  const zips = useMemo<ZipEntry[]>(() => {
    const c = cities.find((ct) => ct.label === selectedCity);
    return c ? c.zips : [];
  }, [cities, selectedCity]);

  // Close dropdowns on outside click
  const countryRef = useClickOutside<HTMLDivElement>(() => setCountryOpen(false));
  const stateRef = useClickOutside<HTMLDivElement>(() => setStateOpen(false));
  const cityRef = useClickOutside<HTMLDivElement>(() => setCityOpen(false));
  const zipRef = useClickOutside<HTMLDivElement>(() => setZipOpen(false));

  // When country changes, reset downstream and set dial code
  const handleCountrySelect = (c: Country) => {
    setSelectedCountry(c);
    setSelectedState("");
    setSelectedCity("");
    setSelectedZip("");
    setCountryOpen(false);

    // If phone was empty or previously had a dial code at the start, replace with new dial
    const trimmed = phone.trim();
    const possibleCodes = AFRICA.map((x) => x.dialCode);
    const hadCode = possibleCodes.some((dc) => trimmed.startsWith(dc));
    if (!trimmed || hadCode) {
      setPhone(c.dialCode + " ");
    }
  };

  const handleStateSelect = (label: string) => {
    setSelectedState(label);
    setSelectedCity("");
    setSelectedZip("");
    setStateOpen(false);
  };

  const handleCitySelect = (label: string) => {
    setSelectedCity(label);
    setSelectedZip("");
    setCityOpen(false);
  };

  const handleZipSelect = (zip: string) => {
    setSelectedZip(zip);
    setZipOpen(false);
  };

  // Framer variants
  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
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
          <p className="font-MontserratSemiBold text-c16 text-161616">Add new address</p>
        </button>
      </div>

      {/* Form */}
      <div className="px-6 pt-7 pb-30">
        <form action="" className="space-y-6">
          {/* Country */}
          <div className="space-y-4">
            <Label className="text-sm pb-4 font-MontserratSemiBold">Country/region</Label>
            <div className="relative pt-4 w-full" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryOpen((p) => !p)}
                className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={selectedCountry.flag || Flag}
                    alt="flag"
                    width={16}
                    height={12}
                  />
                  <span>{selectedCountry.label}</span>
                </div>
                <Image src={CaretDown} alt="select country" width={11} height={6} />
              </button>

              <AnimatePresence>
                {countryOpen && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="absolute left-0 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20"
                  >
                    {AFRICA.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleCountrySelect(option)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      >
                        <Image
                          src={option.flag || Flag}
                          alt="flag"
                          width={16}
                          height={12}
                        />
                        <span>{option.label}</span>
                        <span className="ml-auto text-xs opacity-60">
                          {option.dialCode}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact information */}
          <div>
            <p className="text-sm font-MontserratSemiBold pb-4">Contact information</p>

            <div className="pb-3">
              <Label className="text-sm  font-MontserratSemiBold">Full name</Label>
              <input
                placeholder=""
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
              />
            </div>

            <div>
              <Label className="text-sm  font-MontserratSemiBold">Mobile number</Label>
              <div className="flex items-center p-4 mt-2 border border-gray-300 rounded-lg h-10">
                <Image
                  src={Phone}
                  alt="phone"
                  width={16}
                  height={16}
                  className="mr-2"
                />
                <input
                  placeholder={selectedCountry.dialCode}
                  type="tel"
                  className="w-full outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Address information */}
          <div>
            <p className="text-sm font-MontserratSemiBold pb-4">Address information</p>

            <div className="pb-3">
              <Label className="text-sm  font-MontserratSemiBold">
                Street, house, apartment, unit
              </Label>
              <input
                placeholder=""
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
              />
            </div>

            {/* State */}
            <div className="space-y-4">
              <Label className="text-sm  font-MontserratSemiBold">State/province</Label>
              <div className="relative pt-2 w-full" ref={stateRef}>
                <button
                  type="button"
                  onClick={() => setStateOpen((p) => !p)}
                  className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span>{selectedState || "Select state/province"}</span>
                  </div>
                  <Image src={CaretDown} alt="select state" width={11} height={6} />
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
                      {states.length === 0 ? (
                        <div className="px-3 py-2 text-sm opacity-60">
                          Select a country first
                        </div>
                      ) : (
                        states.map((s) => (
                          <div
                            key={s.label}
                            onClick={() => handleStateSelect(s.label)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {s.label}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* City */}
            <div className="space-y-4 pt-3">
              <Label className="text-sm  font-MontserratSemiBold">City</Label>
              <div className="relative pt-2 w-full" ref={cityRef}>
                <button
                  type="button"
                  onClick={() => setCityOpen((p) => !p)}
                  className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span>{selectedCity || "Select city"}</span>
                  </div>
                  <Image src={CaretDown} alt="select city" width={11} height={6} />
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
                      {cities.length === 0 ? (
                        <div className="px-3 py-2 text-sm opacity-60">
                          Select a state first
                        </div>
                      ) : (
                        cities.map((c) => (
                          <div
                            key={c.label}
                            onClick={() => handleCitySelect(c.label)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {c.label}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Zip */}
            <div className="space-y-4 pt-3">
              <Label className="text-sm  font-MontserratSemiBold">Zip code</Label>
              <div className="relative pt-2 w-full" ref={zipRef}>
                <button
                  type="button"
                  onClick={() => setZipOpen((p) => !p)}
                  className="flex w-full items-center justify-between border border-gray-300 rounded-lg px-3 h-10 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span>{selectedZip || "Select zip/postal code"}</span>
                  </div>
                  <Image src={CaretDown} alt="select zip" width={11} height={6} />
                </button>

                <AnimatePresence>
                  {zipOpen && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="absolute left-0 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg z-20 max-h-60 overflow-auto"
                    >
                      {zips.length === 0 ? (
                        <div className="px-3 py-2 text-sm opacity-60">
                          Select a city first
                        </div>
                      ) : (
                        zips.map((z) => (
                          <div
                            key={z}
                            onClick={() => handleZipSelect(z)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {z}
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Custom Toggle */}
            <div className="pt-6 flex items-center justify-between">
              <span className="text-c2 font-MontserratSemiBold">Set as default address</span>
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

          {/* Submit */}
            <div className="w-full h-20 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center gap-4">
        <Button
          onClick={() => router.push("/cart/mobile/addresses/add-address")}
          className="border-0"
        >
         Save address
        </Button>
      </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import NagerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";
import { CountryData } from "@/types/global";
import DropDown from "@/assets/icons/user-dashboard/Flags/dropdwon.png";
import { div } from "framer-motion/client";

const africanCountries: CountryData[] = [
  {
    code: "NG",
    name: "Nigeria",
    flag: NagerianFlag,
    language: "English",
    currency: "NGN",
  },
  {
    code: "GH",
    name: "Ghana",
    flag: NagerianFlag,
    language: "English",
    currency: "GHS",
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: NagerianFlag,
    language: "English",
    currency: "ZAR",
  },
  {
    code: "EG",
    name: "Egypt",
    flag: NagerianFlag,
    language: "Arabic",
    currency: "EGP",
  },
  {
    code: "KE",
    name: "Kenya",
    flag: NagerianFlag,
    language: "English",
    currency: "KES",
  },
];

// Reusable dropdown component
function CustomSelect<T extends string>({
  label,
  options,
  selected,
  onSelect,
  renderOption,
}: {
  label: string;
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
  renderOption?: (value: T) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex-1 relative pb-2">
      <label className="font-MontserratMedium text-c12 leading-4 mb-2">
        {label}/Region
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full border  border-000000/32 rounded-c8 p-2 "
      >
        {renderOption ? renderOption(selected) : selected}
        <div>
          <Image src={DropDown} alt="select" width={13.75} height={7.5} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-1 w-full bg-white border rounded shadow z-10"
          >
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                {renderOption ? renderOption(option) : option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CountryLanguageCurrencySelect() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    africanCountries[0]
  );
  const [language, setLanguage] = useState(selectedCountry.language);
  const [currency, setCurrency] = useState(selectedCountry.currency);

  const handleCountryChange = (code: string) => {
    const country = africanCountries.find((c) => c.code === code)!;
    setSelectedCountry(country);
    setLanguage(country.language);
    setCurrency(country.currency);
  };

  return (
   <div className="w-full">
    <h2 className="text-base leading-6 font-semibold text-black mb-6">Languages & regions</h2>
     <div className="flex gap-c32">
      
      <div className="w-99">
        {/* Country Dropdown */}
        <CustomSelect
          label="Country"
          options={africanCountries.map((c) => c.code)}
          selected={selectedCountry.code}
          onSelect={(code) => handleCountryChange(code)}
          renderOption={(code) => {
            const country = africanCountries.find((c) => c.code === code)!;
            return (
              <>
                <div className="flex items-center gap-3">
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span>{country.name}</span>
                </div>
              </>
            );
          }}
        />
        <p className="text-c12 font-MontserratNormal text-000000/72 leading-4.75">
          Your country selection determines your langauge and currency which are
          updated automatically
        </p>
      </div>

      {/* Language Dropdown */}
      <div className="w-99">
        <CustomSelect
          label="Language"
          options={[...new Set(africanCountries.map((c) => c.language))]}
          selected={language}
          onSelect={(lang) => setLanguage(lang)}
        />
      </div>

      {/* Currency Dropdown */}
      <div className="w-45.75">
        <CustomSelect
          label="Currency"
          options={[...new Set(africanCountries.map((c) => c.currency))]}
          selected={currency}
          onSelect={(curr) => setCurrency(curr)}
        />
      </div>
    </div>
   </div>
  );
}

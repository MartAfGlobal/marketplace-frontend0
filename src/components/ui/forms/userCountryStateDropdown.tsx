"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Country, State } from "country-state-city";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Address } from "@/types/global";

const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

interface Props {
  country: string;
  state: string;
    onChange: (field: keyof Address, value: string | boolean) => void;
}

export default function UserCountryStateDropdown({ country, state, onChange }: Props) {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [showCountry, setShowCountry] = useState(false);
  const [showState, setShowState] = useState(false);
  const [flag, setFlag] = useState<string>("");

  useEffect(() => {
    const all = Country.getAllCountries();
    setCountries(all);
  }, []);

  useEffect(() => {
    const selected = Country.getAllCountries().find(
  (c) => c.name === country
);
    if (selected) {
      setFlag(getFlagUrl(selected.isoCode));
      setStates(State.getStatesOfCountry(selected.isoCode));
    }
  }, [country]);

  return (
    <div className="flex gap-c24 justify-between w-full">
      {/* COUNTRY SELECT */}
      <div className="relative w-full max-w-67.5">
        <label className="block text-c12 font-MontserratMedium mb-2">
          Country / Region
        </label>
        <div
          onClick={() => setShowCountry((prev) => !prev)}
          className="border border-efefef rounded-c8 p-4 flex justify-between items-center cursor-pointer bg-white relative"
        >
          <div className="flex items-center gap-2">
            {flag && (
              <Image
                src={flag}
                alt="Flag"
                width={20}
                height={20}
                className="rounded-full w-5 h-5 flex-shrink-0"
              />
            )}
            <span className="text-gray-700 text-c12 font-MontserratMedium">
              {country || "Select Country"}
            </span>
          </div>
          {showCountry ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <AnimatePresence>
          {showCountry && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 bg-white border border-efefef rounded-c8 mt-1 max-h-60 overflow-y-auto w-full shadow-lg"
            >
              {countries.map((c) => (
                <li
                  key={c.isoCode}
                  onClick={() => {
                    onChange("country", c.name);
                    setShowCountry(false);
                  }}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-c12 font-MontserratMedium"
                >
                  {c.name}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="relative w-1/2">
        <label className="block text-c12 font-MontserratMedium mb-2">
          State / Province
        </label>
        <div
          onClick={() => setShowState((prev) => !prev)}
          className="border border-efefef rounded-c8 p-4 flex justify-between items-center cursor-pointer bg-white relative"
        >
          <span className="text-gray-700 text-c12 font-MontserratMedium">
            {state || "Select State"}
          </span>
          {showState ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <AnimatePresence>
          {showState && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 bg-white border border-efefef rounded-c8 mt-1 max-h-60 overflow-y-auto w-full shadow-lg"
            >
              {states.length > 0 ? (
                states.map((s) => (
                  <li
                    key={s.isoCode}
                    onClick={() => {
                      onChange("state", s.name);
                      setShowState(false);
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-c12 font-MontserratMedium"
                  >
                    {s.name}
                  </li>
                ))
              ) : (
                <li className="p-3 text-gray-400 text-c12">No states found</li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

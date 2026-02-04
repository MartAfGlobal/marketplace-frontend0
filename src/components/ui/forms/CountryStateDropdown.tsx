"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useHttp } from "@/hooks/use-http";


interface City {
  id: string;
  name: string;
  state: string;
  zone: string;
  zone_name: string;
}

export interface DropdownProps {
  country?: string;
  state?: string;
  city?: string;
  onChange: (field: string, value: string | undefined) => void;
}

/* ================= SHARED STORE ================= */

let sharedStates: string[] = [];
let sharedCities: City[] = [];

/* ================= COUNTRY ================= */

export function CountryDropdown({ country, onChange }: DropdownProps) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const { sendHttpRequest } = useHttp();

  useEffect(() => {
    if (query.length < 2) return;

    const timer = setTimeout(() => {
      sendHttpRequest({
        requestConfig: {
          url: `/locations/countries/search/?q=${query}&operational_only=true&limit=10`,
          method: "GET",
          userType: "buyer",
        },
        successRes: (res: any) =>
          setCountries(res.data?.results || []),
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, sendHttpRequest]);

  const handleSelectCountry = (c: any) => {
    onChange("guest_country", c.name);
      onChange("guest_country_id", c.id)
    onChange("guest_state", undefined);
    onChange("guest_city", undefined);
    onChange("shipping_location_id", undefined);

    sendHttpRequest({
      requestConfig: {
        url: `/shippingcalculator/locations/by_country/?country_id=${c.id}&active_only=true`,
        method: "GET",
        userType: "buyer",
      },
      successRes: (res: any) => {
        sharedCities = res.data || [];
        sharedStates = Array.from(
          new Set(sharedCities.map((c) => String(c.state)))
        );
        console.log ("shareeed stare", sharedStates)
      },
    });

    setShow(false);
  };

  return (
    <div className="relative w-full">
      <label className="block text-c12 font-MontserratMedium mb-2">
        Country / Region
      </label>

      <div
        onClick={() => setShow((p) => !p)}
        className="border border-efefef rounded-c8 h-10 px-3.5 flex justify-between items-center cursor-pointer bg-white"
      >
        <span className="text-gray-700 text-c12 font-MontserratMedium">
          {country || "Select Country"}
        </span>
        {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      <AnimatePresence>
        {show && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 bg-white border border-efefef rounded-c8 mt-1 max-h-60 overflow-y-auto w-full shadow-lg"
          >
            <input
              type="text"
              placeholder="Search country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border-b text-c12 outline-none"
            />

            {countries.map((c) => (
              <li
                key={c.id}
                onClick={() => handleSelectCountry(c)}
                className="p-3 hover:bg-blue-50 cursor-pointer text-c12 font-MontserratMedium"
              >
                {c.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= STATE ================= */

export function StateDropdown({ state, onChange }: DropdownProps) {
  const [show, setShow] = useState(false);

  const handleSelect = (s: string) => {
    onChange("guest_state", s);
    onChange("guest_city", undefined);
    onChange("guest_location_id", undefined);
    setShow(false);
  };

  return (
    <div className="relative w-full">
      <label className="block text-c12 font-MontserratMedium mb-2">
        State / Province
      </label>

      <div
        onClick={() => setShow((p) => !p)}
        className="border border-efefef rounded-c8 h-10 px-3.5 flex justify-between items-center cursor-pointer bg-white"
      >
        <span className="text-gray-700 text-c12 font-MontserratMedium">
          {state || "Select State"}
        </span>
        {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      <AnimatePresence>
        {show && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 bg-white border border-efefef rounded-c8 mt-1 max-h-60 overflow-y-auto w-full shadow-lg"
          >
            {sharedStates.length ? (
              sharedStates.map((s) => (
                <li
                  key={s}
                  onClick={() => handleSelect(s)}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-c12 font-MontserratMedium"
                >
                  {s}
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-400 text-c12">
                Select a country first
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= CITY ================= */

export function CityDropdown({ city, onChange }: DropdownProps) {
  const [show, setShow] = useState(false);

  const handleSelect = (c: City) => {
    onChange("guest_city", c.name);
    onChange("guest_location_id", c.id);
    setShow(false);
  };



  return (
    <div className="relative w-full md:w-1/2">
      <label className="block text-c12 font-MontserratMedium mb-2">
        City
      </label>

      <div
        onClick={() => setShow((p) => !p)}
        className="border border-efefef rounded-c8 h-10 px-3.5 flex justify-between items-center cursor-pointer bg-white"
      >
        <span className="text-gray-700 text-c12 font-MontserratMedium">
          {city || "Select City"}
        </span>
        {show ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      <AnimatePresence>
        {show && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 bg-white border border-efefef rounded-c8 mt-1 max-h-60 overflow-y-auto w-full shadow-lg"
          >
            {sharedCities.length ? (
              sharedCities.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className="p-3 hover:bg-blue-50 cursor-pointer text-c12 font-MontserratMedium"
                >
                  {c.name}
                </li>
              ))
            ) : (
              <li className="p-3 text-gray-400 text-c12">
                Select a state first
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

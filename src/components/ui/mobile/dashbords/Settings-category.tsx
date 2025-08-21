"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CaratRight from "@/assets/mobile/carent-down.png"; // caret icon
import { Button } from "../../Button/Button";
import { useRouter } from "next/navigation";

// Minimal African sample (add more as needed)
const countrySettings: Record<
  string,
  { currency: string; language: string; code: string; flag: string }
> = {
  Nigeria: { currency: "NGN", language: "EN", code: "NG", flag: "🇳🇬" },
  Ghana: { currency: "GHS", language: "EN", code: "GH", flag: "🇬🇭" },
  Kenya: { currency: "KES", language: "EN", code: "KE", flag: "🇰🇪" },
  "South Africa": { currency: "ZAR", language: "EN", code: "ZA", flag: "🇿🇦" },
  Egypt: { currency: "EGP", language: "AR", code: "EG", flag: "🇪🇬" },
  Morocco: { currency: "MAD", language: "FR", code: "MA", flag: "🇲🇦" },
  Ethiopia: { currency: "ETB", language: "AM", code: "ET", flag: "🇪🇹" },
  Algeria: { currency: "DZD", language: "AR", code: "DZ", flag: "🇩🇿" },
  Tunisia: { currency: "TND", language: "AR", code: "TN", flag: "🇹🇳" },
  Uganda: { currency: "UGX", language: "EN", code: "UG", flag: "🇺🇬" },
  Tanzania: { currency: "TZS", language: "EN", code: "TZ", flag: "🇹🇿" },
  Rwanda: { currency: "RWF", language: "EN", code: "RW", flag: "🇷🇼" },
};

export default function Settings() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [toggles, setToggles] = useState({
    orderNotifications: true,
    promotions: false,
    messages: true,
    twoFactor: false,
  });
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] =
    useState<keyof typeof countrySettings>("Nigeria");
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  // Derived values
  const currency = countrySettings[selectedCountry].currency;
  const language = countrySettings[selectedCountry].language;

  // --- helpers
  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Section wrapper
  const Section = ({
    title,
    id,
    children,
  }: {
    title: string;
    id: string;
    children: React.ReactNode;
  }) => {
    const open = openSections.includes(id);
    return (
      <div className="w-full">
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center px-6 justify-between  h-13 border-b border-b-000000/5 ${
            open ? "border-b-0" : "border-b"
          }`}
        >
          <span className="font-semibold text-sm">{title}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image src={CaratRight} alt="Toggle" width={11} height={6} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className=" px-6">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11.5 h-6 rounded-full transition-colors duration-300 ${
        value ? "bg-ff715b" : "bg-gray-300"
      }`}
    >
      <motion.span
        layout
        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ left: value ? "24px" : "2px" }}
      />
    </button>
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node))
        setIsRegionOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsRegionOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto mt-6">
      {/* 1) Notification Settings */}
      <Section title="Notification Settings" id="notifications">
        <div className="flex items-center justify-between py-3 border-b  border-b-000000/5 text-sm font-MontserratNormal">
          <span>Order notifications</span>
          <Toggle
            value={toggles.orderNotifications}
            onChange={() => toggleSwitch("orderNotifications")}
          />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-b-000000/5 text-sm font-MontserratNormal">
          <span>Promotions</span>
          <Toggle
            value={toggles.promotions}
            onChange={() => toggleSwitch("promotions")}
          />
        </div>
        <div className="flex items-center justify-between py-3 border-b-000000/5 text-sm font-MontserratNormal">
          <span>Messages</span>
          <Toggle
            value={toggles.messages}
            onChange={() => toggleSwitch("messages")}
          />
        </div>
      </Section>

      {/* 2) Language & Region */}
      <Section title="Language & Region" id="language-region">
        {/* Shipping To row */}
        <div ref={dropdownRef} className="relative ">
          <div className="flex items-center justify-between py-3 border-b border-b-000000/5 text-sm font-MontserratNormal">
            <span>Shipping to</span>

            <button
              type="button"
              onClick={() => setIsRegionOpen((o) => !o)}
              className="flex items-center gap-2 font-semibold"
            >
              <span>{countrySettings[selectedCountry].flag}</span>
              <span>{countrySettings[selectedCountry].code}</span>
            </button>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {isRegionOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 z-20 mt-2 max-h-60 overflow-y-auto bg-white border rounded-lg shadow w-48"
              >
                {Object.keys(countrySettings).map((country) => {
                  const c = countrySettings[country];
                  return (
                    <li
                      key={country}
                      onClick={() => {
                        setSelectedCountry(
                          country as keyof typeof countrySettings
                        );
                        setIsRegionOpen(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                      </span>
                      <span className="text-sm opacity-70">{c.code}</span>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Auto-updated currency + language */}
        <div className="flex items-center justify-between py-3 border-b border-b-000000/5 text-sm font-MontserratNormal">
          <span>Currency</span>
          <span className="font-semibold">{currency}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span>Language</span>
          <span className="font-semibold">{language}</span>
        </div>
      </Section>

      {/* 3) Password & Security */}
      <Section title="Password & Security" id="security">
        <div className=" py-3 border-b border-b-000000/5 text-sm font-MontserratNormal">
          <button type="button" className="text-[#FF715B] font-semibold">
            Change password
          </button>
        </div>
        <div className="flex items-center justify-between  border-b border-b-000000/5 text-sm font-MontserratNormal  py-3">
          <span>Enable 2-factor verification</span>
          <Toggle
            value={toggles.twoFactor}
            onChange={() => toggleSwitch("twoFactor")}
          />
        </div>
      </Section>
      <div className="text-sm font-MontserratSemiBold px-6 pb-38 "> 
        <div className="flex items-center h-11 border-b border-b-000000/5">
          <span>Privacy policy</span>
        </div>

        <div className="flex items-center h-11 border-b border-b-000000/5">
          <span>Legal information</span>
        </div>
        <div className="flex items-center h-11 border-b border-b-000000/5">
         <button className="text-ff715b">Delete account</button>
        </div>
      
      </div>
      <div className="w-full h-30 bg-ffffff circle-shadow px-6 fixed left-0 bottom-0 md:hidden z-50 flex items-center  justify-center ">
        

        <Button
          onClick={() => router.push("/")}
          className="border border-ff715b bg-transparent w-full max-w-36 text-ff715b font-MontserratSemiBold text-sm "
        >
         Log out
        </Button>
      </div>
    </div>
  );
}

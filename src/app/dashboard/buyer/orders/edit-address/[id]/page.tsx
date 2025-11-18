"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import NavBack from "@/assets/icons/navBacksmall.png";
import Phone from "@/assets/mobile/Phone.png";
import CaretDown from "@/assets/mobile/carent-down.png";
import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";

import { Label } from "@/components/ui/forms/Label";
import { Button } from "@/components/ui/Button/Button";
import { Country, State } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { useDispatch, useSelector } from "react-redux";

import { Address, OrderAddress } from "@/types/global";
import { RootState } from "@/store";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";

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

const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

export default function Editaddreess() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.token.token);
  const buyerAddresses = useSelector(
    (state: RootState) => state.buyer.BuyerAddresses
  );
  const { orders } = useSelector((state: any) => state.orders);

  const order = orders.find((o: any) => o.id === id);
  const addressId = order.shipping_address;

  console.log ("oorder id", order.id)

  const address = buyerAddresses.find((ad: any) => ad.id === addressId);

  // -------------------------------
  // FORM INITIAL VALUES
  // -------------------------------
  const [formData, setFormData] = useState<OrderAddress>({
     id:  order.id || null,
    country: address?.country || "",
    full_name: address?.full_name || "",
    phone: address?.phone || "",
    state: address?.state || "",
    city: address?.city || "",
    postal_code: address?.postal_code || "",
    address: address?.address || "",
    is_default: address?.is_default || false,
  });

  // Country + State only
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [selectedState, setSelectedState] = useState<any | null>(null);
  const [flag, setFlag] = useState<string>(NigerianFlag.src);

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const [isDefault, setIsDefault] = useState(formData.is_default);

  const countryRef = useClickOutside<HTMLDivElement>(() =>
    setCountryOpen(false)
  );
  const stateRef = useClickOutside<HTMLDivElement>(() => setStateOpen(false));

  const { loading, sendHttpRequest } = useHttp();

  // -------------------------------
  // LOAD COUNTRIES + INITIAL COUNTRY
  // -------------------------------
useEffect(() => {
  const allCountries = Country.getAllCountries();
  setCountries(allCountries);

  // If no address or no address.country → default to Nigeria
  const defaultCountry =
    allCountries.find((c) => c.name.toLowerCase() === "nigeria") ||
    allCountries[0];

  // Pick country from address OR fallback to Nigeria
  const savedCountry =
    allCountries.find((c) => c.name === address?.country) || defaultCountry;

  setSelectedCountry(savedCountry);
  setFlag(getFlagUrl(savedCountry.isoCode));

  setFormData((prev) => ({
    ...prev,
    country: savedCountry.name,
    phone: prev.phone || `+234 `, // auto phonecode for Nigeria
  }));
}, [address]);
;

  // -------------------------------
  // LOAD STATES WHEN COUNTRY SETS
  // -------------------------------
  useEffect(() => {
    if (!selectedCountry || !address) return;

    const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(countryStates);

    const savedState = countryStates.find((s) => s.name === address.state);
    setSelectedState(savedState || null);
  }, [selectedCountry, address]);

  // Handle form change
  const handleChange = (field: keyof Address, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountrySelect = (c: any) => {
    if (!c) return;
    setSelectedCountry(c);
    setFlag(getFlagUrl(c.isoCode));
    setCountryOpen(false);

    setSelectedState(null);

    setFormData((prev) => ({
      ...prev,
      country: c.name,
      phone: "+" + c.phonecode + " ",
      state: "",
      city: "",
      postal_code: "",
    }));
  };

  const handleStateSelect = (s: any) => {
    if (!s) return;

    setSelectedState(s);
    setStateOpen(false);

    setFormData((prev) => ({
      ...prev,
      state: s.name,
    }));
  };

  // Guard if token missing
  useEffect(() => {
    if (!token) {
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) router.replace("/?showLogin=true");
      else router.replace("/auth/login");
    }
  }, [token]);

  // SAVE
  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!token) return;

    const { id, ...bodyWithoutId } = formData;

    sendHttpRequest({
      requestConfig: {
        url: `orders/${formData.id}/edit-shipping-address/`,
        method: "POST",
        body: bodyWithoutId,
        token,
        isAuth: true,
        successMessage: "Address added successfully!",
        userType: "buyer",
      },
      successRes: (res) => {
        dispatch(buyerActions.addBuyerAddress(res.data));
        router.back();
      },
    });
  };

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
          <Image src={NavBack} alt="<" width={9} height={16.5} />
          <p className="font-MontserratSemiBold text-c16 text-161616">
            Add new address
          </p>
        </button>
      </div>

      <div className="px-6 pt-7 pb-30">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Country */}
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
                <Image src={CaretDown} alt="select" width={11} height={6} />
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
                <Image src={Phone} alt="phone" width={16} height={16} />
                <input
                  type="tel"
                  className="w-full outline-none"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Address */}
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

            {/* State */}
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
                  <Image src={CaretDown} alt="select" width={11} height={6} />
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

            {/* City (manual input) */}
            <div className="pb-3 pt-3">
              <Label className="text-sm font-MontserratSemiBold">City</Label>
              <input
                type="text"
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Enter city (e.g., Abuja)"
              />
            </div>

            {/* Postal code */}
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

            {/* Default toggle */}
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

          {/* Submit */}
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

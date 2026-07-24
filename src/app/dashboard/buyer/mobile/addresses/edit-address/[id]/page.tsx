"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
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

import { Address } from "@/types/global";
import { RootState } from "@/store";
import { buyerActions } from "@/store/user-data/buyer/buyer-slice";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/* ---------------- helpers ---------------- */

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

const getFlagUrl = (iso: string) =>
  `https://flagcdn.com/w20/${iso.toLowerCase()}.png`;

/* ---------------- component ---------------- */

export default function EditAddressPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const addressId = Number(params.id);

  const token = useSelector((state: RootState) => state.token.token);
  const { loading, sendHttpRequest } = useHttp();

  const [formData, setFormData] = useState<Address>({
    id: "",
    shipping_location: "",
    country: "",
    first_name: "",
    last_name: "",
    phone: "",
    state: "",
    city: "",
    postal_code: "",
    address: "",
    is_default: false,
  });

  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [flag, setFlag] = useState(NigerianFlag.src);
  const [isDefault, setIsDefault] = useState(false);

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const countryRef = useClickOutside<HTMLDivElement>(() =>
    setCountryOpen(false)
  );
  const stateRef = useClickOutside<HTMLDivElement>(() =>
    setStateOpen(false)
  );
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
  /* ---------------- auth guard ---------------- */

  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, router]);

  /* ---------------- fetch address ---------------- */

  useEffect(() => {
    if (!token || !addressId) return;

    (async () => {
      try {
        const res = await fetch(
          `/shipping/shipping-addresses/${addressId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Fetch failed");
        const data: Address = await res.json();

        setFormData(data);
        setIsDefault(data.is_default);

        const country = Country.getAllCountries().find(
          (c) => c.name === data.country
        );

        if (country) {
          setSelectedCountry(country);
          setFlag(getFlagUrl(country.isoCode));

          const st = State.getStatesOfCountry(country.isoCode);
          setStates(st);

          const matchedState = st.find(
            (s) => s.name === data.state
          );
          setSelectedState(matchedState || null);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token, addressId]);

  /* ---------------- handlers ---------------- */

  const handleChange = (
    field: keyof Address,
    value: string | boolean
  ) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleCountrySelect = (c: any) => {
    setSelectedCountry(c);
    setFlag(getFlagUrl(c.isoCode));
    setCountryOpen(false);

    const st = State.getStatesOfCountry(c.isoCode);
    setStates(st);
    setSelectedState(null);

    setFormData((p) => ({
      ...p,
      country: c.name,
      state: "",
      city: "",
      postal_code: "",
      phone: "+" + c.phonecode + " ",
    }));
  };

  const handleStateSelect = (s: any) => {
    setSelectedState(s);
    setStateOpen(false);
    setFormData((p) => ({ ...p, state: s.name }));
  };

  /* ---------------- submit ---------------- */

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      ...formData,
      is_default: isDefault,
      phone: formData.phone.trim(),
    };

    sendHttpRequest({
      requestConfig: {
        url: `/shipping/shipping-addresses/${addressId}/`,
        method: "PATCH",
        body: payload,
        token,
        isAuth: true,
        successMessage: "Address updated successfully",
        userType: "buyer",
      },
      successRes: (res) => {
        dispatch(buyerActions.updateBuyerAddress(res.data));
        router.back();
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div>
      <div className="px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 mt-3"
        >
          <Image src={NavBack} alt="<" width={9} height={16} />
          <p className="font-MontserratSemiBold text-c16">
            Edit address
          </p>
        </button>
      </div>

      <div className="px-6 pt-7 pb-30">
        <form onSubmit={handleSave} className="space-y-6">
          {/* COUNTRY */}
          <div>
            <Label>Country/region</Label>
            <div ref={countryRef} className="relative mt-2">
              <button
                type="button"
                onClick={() => setCountryOpen((p) => !p)}
                className="w-full border h-10 rounded-lg flex items-center justify-between px-3"
              >
                <div className="flex items-center gap-2">
                  <Image src={flag} alt="" width={16} height={12} />
                  {selectedCountry?.name}
                </div>
                <Image src={CaretDown} alt="" width={11} height={6} />
              </button>

              <AnimatePresence>
                {countryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bg-white w-full shadow-lg mt-2 z-20 max-h-60 overflow-auto"
                  >
                    {countries.map((c) => (
                      <div
                        key={c.isoCode}
                        onClick={() => handleCountrySelect(c)}
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
                onChange={(e) => handleChange("first_name", e.target.value)}
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
                onChange={(e) => handleChange("last_name", e.target.value)}
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
                  type="number"
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
            <Label className="text-sm font-MontserratSemiBold">
              City
            </Label>
            <input
              type="text"
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg h-10"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter city"
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
              {loading ? <LoadingSpinner/> : "Update address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

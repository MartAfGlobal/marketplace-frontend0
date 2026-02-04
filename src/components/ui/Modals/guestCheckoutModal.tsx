"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button/Button";
import { Label } from "../forms/Label";
import { Input } from "../forms/Input";
import Image from "next/image";
import {
  AddressModalProps,
  Address,
  GuestCheckoutAddress,
  CheckOutModalProps,
} from "@/types/global";

import MobileIcon from "@/assets/icons/callIcon.png";
import StateIcon from "@/assets/icons/mobileIcon.png";
import CityIcon from "@/assets/icons/callIcon.png";

import NigerianFlag from "@/assets/icons/user-dashboard/Flags/Nigeria.png";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// country-state-city
import { Country, State } from "country-state-city";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { LoadingSpinner } from "../loading-spinner";

import {
  CityDropdown,
  CountryDropdown,
  StateDropdown,
} from "../forms/CountryStateDropdown";
import { RootState } from "@/store";
import { setCheckoutSummary } from "@/store/cart/cartSlice";
// token read from Redux store

// helper: map ISO code to flag URL
const getFlagUrl = (isoCode: string) =>
  `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;

export default function GuestCheckoutModal({
  isOpen,
  onClose,
  isEditing,
  selectedItems,
  currentAddress,
}: CheckOutModalProps) {
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

  const router = useRouter();

  const [streetError, setStreetError] = useState("");

  const [states, setStates] = useState<any[]>([]);
  const [flag, setFlag] = useState<string>(NigerianFlag.src);

  const dispatch = useDispatch();
  const checkoutSummary = useSelector(
    (state: RootState) => state.cart.checkoutSummary,
  );

  const checkoutItems = useSelector(
    (state: RootState) => state.cart.checkoutItems,
  );

  useEffect(() => {
    console.log("Selected Items in Guest Checkout Modal:", selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === formData.guest_shipping_address.country,
    );

    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
      setFlag(getFlagUrl(selectedCountry.isoCode));
    }
  }, [formData.guest_shipping_address.country]);

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

  const { loading, sendHttpRequest: saveRequest } = useHttp();

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
        successMessage: "Redirecting to payment gateway...",
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
        onClose?.();
        router.push("/cart/checkout");
      },
    });

    setStreetError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex h-dvh items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="bg-white p-8 rounded-2xl max-w-157.25 w-full h-fit max-h-166 relative overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h2 className="font-MontserratSemiBold text-c16 mb-c24">
              {!isEditing ? "Enter Shipping Address" : "Edit Shipping Address"}
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex gap-c24 w-full ">
                <CountryDropdown
                  country={formData.guest_shipping_address.country}
                  onChange={handleChange}
                />
                <StateDropdown
                  state={formData.guest_shipping_address.state}
                  onChange={handleChange}
                />
              </div>

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-6  text-000000">
                  Contact information
                </p>
                <div className="flex gap-c24 w-full mb-c24">
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      First Name
                    </Label>
                    <Input
                      id="guest_first_name"
                      name="guest_first_name"
                      type="text"
                      value={formData.guest_first_name}
                      onChange={(e) =>
                        handleChange("guest_first_name", e.target.value)
                      }
                      placeholder="Truth"
                      className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.guest_last_name}
                      onChange={(e) =>
                        handleChange("guest_last_name", e.target.value)
                      }
                      placeholder="john"
                      className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                    />
                  </div>
                </div>

                <div className="flex gap-c24 w-full">
                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.guest_email}
                      onChange={(e) =>
                        handleChange("guest_email", e.target.value)
                      }
                      placeholder="truthokoye@gamil.com"
                      className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                    />
                  </div>

                  <div className="flex flex-col gap-2 relative w-1/2">
                    <Label className="text-c12 font-MontserratMedium">
                      Mobile Number
                    </Label>
                    <div className="relative w-full flex items-center">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Image
                          src={MobileIcon}
                          alt="Mobile Number"
                          width={15.62}
                          height={15.62}
                        />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.guest_phone}
                        onChange={(e) =>
                          handleChange("guest_phone", e.target.value)
                        }
                        placeholder="+2347058675432"
                        className="border border-efefef rounded-c8 p-4 pl-8 w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-MontserratSemiBold text-c12 mb-6 text-000000">
                  Address information
                </p>
                <div className="flex flex-col gap-c24">
                  <div className="flex gap-c24 w-full">
                    {/* City */}
                    <CityDropdown
                      city={formData.guest_shipping_address.city}
                      onChange={handleChange}
                    />

                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        value={formData.guest_shipping_address.postal_code}
                        onChange={(e) =>
                          handleChange("postal_code", e.target.value)
                        }
                        placeholder="100001"
                        className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-c24 w-full">
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Street / House / Apartment / Unit
                      </Label>
                      <Input
                        type="text"
                        value={formData.guest_shipping_address.line1}
                        onChange={(e) => handleChange("line1", e.target.value)}
                        placeholder="12 Broad Street"
                        className={`border rounded-c8 p-4 pl-10 w-full text-c12 font-MontserratMedium ${
                          streetError ? "border-red-500" : "border-efefef"
                        }`}
                      />
                      {streetError && (
                        <p className="text-red-500 text-xs mt-1">
                          {streetError}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 relative w-1/2">
                      <Label className="text-c12 font-MontserratMedium">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="guest_address_line2"
                        name="guest_address_line2"
                        type="text"
                        value={formData.guest_shipping_address.line2}
                        onChange={(e) => handleChange("line2", e.target.value)}
                        placeholder="12 Broad Street"
                        className="border border-efefef rounded-c8 p-4  w-full text-c12 font-MontserratMedium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mt-c24">
              <Button
                disabled={loading || invalidForm}
                onClick={handleCheckout}
                className="w-full max-w-50.5 bg-ff715b text-white flex justify-center items-center"
              >
                {loading ? <LoadingSpinner /> : "Checkout"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, X } from "lucide-react";
import React from "react";
import { ShippingAddress } from "@/types/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: ShippingAddress) => void;
}

export function AddAddressModal({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = React.useState<ShippingAddress>({
    id: 0,
    name: "",
    street: "",
    phone_number: "",
    full_name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "NG",
    phone: "",
    is_default: false,
  });

  const handleChange = (
    field: keyof ShippingAddress,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(form); // api call
      onClose();
    } catch (error: any) {
      console.error("Address submission failed:", error.message || error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl max-w-2xl p-6 sm:p-8">
        <div className="relative">
          <h2 className="text-lg font-semibold mb-4">Add new address</h2>

          {/* Country */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Country/region
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-[50%] border rounded px-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
            />
          </div>

          {/* Contact Info */}
          <div>
            <p className="font-medium mb-3">Personal Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-normal mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-normal mb-1">
                  Mobile number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full border rounded pl-10 pr-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div>
            <p className="font-medium mb-3">Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-normal mb-1">
                  State/province
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="w-full border rounded pl-10 pr-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-normal mb-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full border rounded pl-10 pr-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ZIP code
                </label>
                <input
                  type="text"
                  value={form.postal_code}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Street, house, apartment, unit
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full border rounded pl-10 pr-3 py-2 focus:ring-1 focus:ring-[#FF715B] focus:border-[#ff4d2d] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Default toggle */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="default"
              checked={form.is_default}
              onChange={(e) => handleChange("is_default", e.target.checked)}
              className="accent-[#FF715B] h-4 w-4"
            />
            <label htmlFor="default" className="text-sm">
              Set as default address
            </label>
          </div>

          <Button
            className="w-[40%] ml-64 bg-[#FF715B] hover:bg-[#ff4d2d] text-white"
            onClick={handleSubmit}
          >
            Save address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

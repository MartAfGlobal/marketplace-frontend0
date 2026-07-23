"use client";

import React from "react";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";
import { ToggleSwitch } from "./shared/toggle-switch";
import { TextInput } from "./shared/text-input";

interface ShippingInfoTabProps {
  isEditing: boolean;
  /** Zones fetched from GET /shippingcalculator/zones/active/ — label = name, value = uuid id. */
  shippingZones: { label: string; value: string }[];
  formData: {
    shipping_zone: string;
    // Shipping address — nested keys matching backend PATCH body
    shipping_address_line_1: string;
    shipping_address_line_2: string;
    shipping_city: string;
    shipping_state: string;
    shipping_country: string;
    shipping_postal_code: string;
    // Return address — nested keys matching backend PATCH body
    return_address_line_1: string;
    return_address_line_2: string;
    return_city: string;
    return_state: string;
    return_country: string;
    return_postal_code: string;
  };
  shippingSameAsBusiness: boolean;
  returnSameAsBusiness: boolean;
  onShippingSameToggle: () => void;
  onReturnSameToggle: () => void;
  /** Called with (fieldKey, value) — uses the flat form-state key names. */
  onFieldChange: (field: string, value: string) => void;
}

export default function ShippingInfoTab({
  isEditing,
  shippingZones,
  formData,
  shippingSameAsBusiness,
  returnSameAsBusiness,
  onShippingSameToggle,
  onReturnSameToggle,
  onFieldChange,
}: ShippingInfoTabProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Shipping zone */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full md:max-w-md">
          <label className="">Shipping zone</label>
          <div className="relative">
            {/*
              DropdownInput shows `opt.label` (zone name) in the trigger,
              but calls onChange with `opt.value` (zone uuid) — so the form
              stores the ID, which is what the API expects on save.
            */}
            <DropdownInput
              disabled={!isEditing}
              placeholder="Select shipping zone"
              options={shippingZones}
              value={formData.shipping_zone}
              onChange={(val) => onFieldChange("shipping_zone", val)}
            />
          </div>
        </div>
      </div>

      {/* Shipping information */}
      <div className="flex flex-col gap-6">
        <h3 className="text-[16px] font-MontserratMedium text-[#161616]">Shipping information</h3>

        <div className="flex items-center gap-3">
          <ToggleSwitch
            checked={shippingSameAsBusiness}
            onChange={onShippingSameToggle}
            disabled={!isEditing}
          />
          <span className="text-[13px] text-[#666666] font-MontserratMedium">
            Same as business address
          </span>
        </div>

        {!shippingSameAsBusiness && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <TextInput
              label="Address line 1"
              name="shipping_address_line_1"
              value={formData.shipping_address_line_1}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("shipping_address_line_1", e.target.value)}
            />
            <TextInput
              label="Address line 2"
              name="shipping_address_line_2"
              value={formData.shipping_address_line_2}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("shipping_address_line_2", e.target.value)}
            />
            <TextInput
              label="City/Town"
              name="shipping_city"
              value={formData.shipping_city}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("shipping_city", e.target.value)}
            />
            <TextInput
              label="State/Region"
              name="shipping_state"
              value={formData.shipping_state}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("shipping_state", e.target.value)}
            />
            <TextInput
              label="Country"
              name="shipping_country"
              value={formData.shipping_country}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("shipping_country", e.target.value)}
            />
            <TextInput
              label="Postal code"
              name="shipping_postal_code"
              value={formData.shipping_postal_code}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("shipping_postal_code", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Return address */}
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-[16px] font-MontserratMedium text-[#161616] mb-1">Return address</h3>
          <p className="text-[12px] text-[#999999] font-MontserratMedium">Address used for goods returns</p>
        </div>

        <div className="flex items-center gap-3">
          <ToggleSwitch
            checked={returnSameAsBusiness}
            onChange={onReturnSameToggle}
            disabled={!isEditing}
          />
          <span className="text-[13px] text-[#666666] font-MontserratMedium">
            Same as business address
          </span>
        </div>

        {!returnSameAsBusiness && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <TextInput
              label="Address line 1"
              name="return_address_line_1"
              value={formData.return_address_line_1}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("return_address_line_1", e.target.value)}
            />
            <TextInput
              label="Address line 2"
              name="return_address_line_2"
              value={formData.return_address_line_2}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("return_address_line_2", e.target.value)}
            />
            <TextInput
              label="City/Town"
              name="return_city"
              value={formData.return_city}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("return_city", e.target.value)}
            />
            <TextInput
              label="State/Region"
              name="return_state"
              value={formData.return_state}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("return_state", e.target.value)}
            />
            <TextInput
              label="Country"
              name="return_country"
              value={formData.return_country}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("return_country", e.target.value)}
            />
            <TextInput
              label="Postal code"
              name="return_postal_code"
              value={formData.return_postal_code}
              disabled={!isEditing}
              onChange={(e) => onFieldChange("return_postal_code", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

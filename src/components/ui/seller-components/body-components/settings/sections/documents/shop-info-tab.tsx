"use client";

import React from "react";
import { Store } from "lucide-react";
import { Label } from "@/components/ui/forms/Label";
import { Input } from "@/components/ui/forms/Input";
import { DropdownInput } from "@/components/ui/forms/auth/sellers/registrastionSteps/registered-business/modals/business-type";

interface ShopInfoTabProps {
  isEditing: boolean;
  businessType: string;
  formData: {
    company_name: string;
    business_industry: string;
  };
  industries: string[];
  fetchingIndustries: boolean;
  onChange: (field: string, value: string) => void;
}

export default function ShopInfoTab({
  isEditing,
  businessType,
  formData,
  industries,
  fetchingIndustries,
  onChange,
}: ShopInfoTabProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Business Type (read-only display) */}
      <div className="flex flex-col gap-4">
        <Label className="">Business type</Label>
        <div className="flex items-center gap-6">
          <Label className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                businessType === "Registered company"
                  ? "border-[#ff6b6b]"
                  : "border-[#cccccc]"
              }`}
            >
              {businessType === "Registered company" && (
                <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
              )}
            </div>
            <span
              className={`text-[13px] font-MontserratMedium ${
                businessType === "Registered company"
                  ? "text-[#333333]"
                  : "text-[#666666]"
              }`}
            >
              Registered company
            </span>
          </Label>

          <Label className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                businessType === "Individual" ? "border-[#ff6b6b]" : "border-[#cccccc]"
              }`}
            >
              {businessType === "Individual" && (
                <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
              )}
            </div>
            <span
              className={`text-[13px] font-MontserratMedium ${
                businessType === "Individual" ? "text-[#333333]" : "text-[#666666]"
              }`}
            >
              Individual
            </span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Name / Full Name */}
        <div className="flex flex-col gap-2">
          <Label className="">
            {businessType === "Registered company" ? "Business name" : "Full legal name"}
          </Label>
          <div className="relative">
            <Input
              type="text"
              name="company_name"
              value={businessType ==="Registered company"? formData.company_name : formData.company_name}
              onChange={(e) => onChange("company_name", e.target.value)}
              disabled={!isEditing}
              placeholder={
                businessType === "Registered company" ? "e.g Acme" : "Enter your full name"
              }
              className={`${!isEditing ? "bg-gray-50 text-[#999999]" : "bg-white"}`}
            />
            <Store
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cccccc]"
            />
          </div>
        </div>

        {/* Business Industry */}
        <div className="flex flex-col gap-2">
          <Label className="">Business Industry</Label>
          <div className="relative">
            <DropdownInput
              disabled={!isEditing}
              loading={fetchingIndustries}
              placeholder="Select business industry"
              options={industries}
              value={formData.business_industry}
              onChange={(val) => onChange("business_industry", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

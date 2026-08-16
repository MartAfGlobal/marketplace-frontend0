"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";

interface ShopInformationProps {
  seller: any;
}

export default function ShopInformation({ seller }: ShopInformationProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <h3 className="font-MontserratNormal text-base">Business details</h3>
      {/* <div className="flex flex-col gap-4">
        <Label className="">Business type</Label>
        <div className="flex items-center gap-6">
          <Label className="flex items-center gap-2 cursor-not-allowed opacity-70">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                seller?.is_registered_business
                  ? "border-[#ff6b6b]"
                  : "border-[#cccccc]"
              }`}
            >
              {seller?.is_registered_business && (
                <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
              )}
            </div>
            <span
              className={`text-[13px] font-MontserratMedium ${
                seller?.is_registered_business
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
                !seller?.is_registered_business
                  ? "border-[#ff6b6b]"
                  : "border-[#cccccc]"
              }`}
            >
              {!seller?.is_registered_business && (
                <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
              )}
            </div>
            <span
              className={`text-[13px] font-MontserratMedium ${
                !seller?.is_registered_business
                  ? "text-[#333333]"
                  : "text-[#666666]"
              }`}
            >
              Individual
            </span>
          </Label>
        </div>
      </div> */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 items-center">
        <div className="flex flex-col gap-1.5">
          <Label className="">Store name</Label>
          <Input
            value={seller?.company_name || ""}
            readOnly
            className=" cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            Business type
          </Label>
          <Input
            value={seller?.is_registered_business? "Registered Business":"Individua"}
            readOnly
            className="-allowed"
          />
        </div>
       {seller?.is_registered_business && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            Registration number
          </Label>
          <Input
            value={seller?.business_registration_number || seller?.CAC_No || ""}
            readOnly
            className="-allowed"
          />
        </div>)}
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            Country
          </Label>
          <Input
            value={seller?.company_country || seller?.country || ""}
            readOnly
            className="-allowed"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            State
          </Label>
          <Input
            value={seller?.company_state || seller?.state || ""}
            readOnly
            className="-allowed"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            Business Industry
          </Label>
          <Input
            value={seller?.business_industry || ""}
            readOnly
            className="-allowed"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-[66%]">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            City
          </Label>
          <Input
            value={seller?.company_city || seller?.city || ""}
            readOnly
            className="-allowed"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">
            Postal code
          </Label>
          <Input
            value={seller?.company_postal_code || seller?.postal_code || ""}
            readOnly
            className="-allowed"
          />
        </div>
      </div>
    </div>
  );
}

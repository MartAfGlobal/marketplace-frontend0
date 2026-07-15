"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";

interface ShippingInformationProps {
  seller: any;
}

export default function ShippingInformation({ seller }: ShippingInformationProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      {/* Shipping Address */}
      <div className="flex flex-col gap-6">
        <h3 className="font-MontserratNormal  text-base">
          Shipping information
        </h3>

        <div className="flex items-center gap-2">
          {/* Custom read-only toggle */}
          <div className="w-8 h-4 bg-gray-200 rounded-full relative">
            <div className="w-3.5 h-3.5 bg-white rounded-full absolute left-0.5 top-[1px] shadow-sm"></div>
          </div>
          <span className="text-xs font-MontserratMedium text-gray-500">
            Same as business address
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Address line 1
            </Label>
            <Input
              value={seller?.shipping_address_line1 || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Address line 2
            </Label>
            <Input
              value={seller?.shipping_address_line2 || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              City/Town
            </Label>
            <Input
              value={seller?.shipping_city || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              State/Region
            </Label>
            <Input
              value={seller?.shipping_state || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Country
            </Label>
            <Input
              value={seller?.shipping_country || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Postal code
            </Label>
            <Input
              value={seller?.shipping_postal_code || ""}
              readOnly
              className=""
            />
          </div>
        </div>
      </div>

      {/* Return Address */}
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-MontserratMedium text-[#666666] text-sm">
            Return address
          </h3>
          <p className="text-xs font-MontserratNormal text-gray-400 mt-1">
            Address used for good returns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-gray-200 rounded-full relative">
            <div className="w-3.5 h-3.5 bg-white rounded-full absolute left-0.5 top-[1px] shadow-sm"></div>
          </div>
          <span className="text-xs font-MontserratMedium text-gray-500">
            Same as business address
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Address line 1
            </Label>
            <Input
              value={seller?.return_address_line1 || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Address line 2
            </Label>
            <Input
              value={seller?.return_address_line2 || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              City/Town
            </Label>
            <Input
              value={seller?.return_city || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              State/Region
            </Label>
            <Input
              value={seller?.return_state || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Country
            </Label>
            <Input
              value={seller?.return_country || ""}
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">
              Postal code
            </Label>
            <Input
              value={seller?.return_postal_code || ""}
              readOnly
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

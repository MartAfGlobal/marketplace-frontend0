"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { AdminSellerDetailsData, KycVerificationData } from "@/types/global";

interface ShippingInformationProps {
  seller: AdminSellerDetailsData | KycVerificationData | any;
}

export default function ShippingInformation({
  seller,
}: ShippingInformationProps) {
  const shippingAddr = seller?.shipping_address;
  const returnAddr = seller?.return_address;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in">
      {/* Shipping Address */}
      <div className="flex flex-col gap-6">
        <h3 className="font-MontserratNormal  text-base">
          Shipping information
        </h3>

        <div className="flex items-center gap-2">
          {/* Same as business address toggle (read-only) */}
          <div
            className={`cursor-not-allowed w-8 h-4 rounded-full relative transition-colors bg-gray-200`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[1px] shadow-sm transition-transform ${
                shippingAddr?.same_as_business_address
                  ? "left-[18px]"
                  : "left-0.5"
              }`}
            />
          </div>
          <span className="text-xs font-MontserratMedium text-gray-500">
            Same as business address
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="">Address line 1</Label>
            <Input
              value={
                shippingAddr?.same_as_business_address
                  ? seller.company_address
                  : shippingAddr.address_line_1 || "Not set"
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">Address line 2</Label>
            <Input
              value={
                shippingAddr?.same_as_business_address
                  ? seller.company_address_line_2
                  : shippingAddr.address_line_2
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">City/Town</Label>
            <Input
              value={
                shippingAddr?.same_as_business_address
                  ? seller.company_city
                  : shippingAddr.city
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">State/Region</Label>
            <Input
              value={
                shippingAddr?.same_as_business_address
                  ? seller.company_state
                  : shippingAddr.state
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">Country</Label>
            <Input
              value={
                shippingAddr?.same_as_business_address
                  ? seller.company_country
                  : shippingAddr.country
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">Postal code</Label>
            <Input
              value={
                shippingAddr?.same_as_business_address
                  ? seller.company_postal_code
                  : shippingAddr.postal_code
              }
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
          <div
            className={`cursor-not-allowed w-8 h-4 rounded-full relative transition-colors bg-gray-200`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[1px] shadow-sm transition-transform ${
                returnAddr?.same_as_business_address
                  ? "left-[18px]"
                  : "left-0.5"
              }`}
            />
          </div>
          <span className="text-xs font-MontserratMedium text-gray-500">
            Same as business address
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1.5">
            <Label className="">Address line 1</Label>
            <Input
              value={
                returnAddr?.same_as_business_address
                  ? seller.company_address
                  : returnAddr.address_line_1
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">Address line 2</Label>
            <Input
              value={
                returnAddr?.same_as_business_address
                  ? seller.company_address_line_2
                  : returnAddr.address_line_2
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">City/Town</Label>
           <Input
              value={
                returnAddr?.same_as_business_address
                  ? seller.company_city
                  : returnAddr.city
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">State/Region</Label>
            <Input
              value={
                returnAddr?.same_as_business_address
                  ? seller.company_state
                  : returnAddr.state
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">Country</Label>
            <Input
              value={
                returnAddr?.same_as_business_address
                  ? seller.company_country
                  : returnAddr.country
              }
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="">Postal code</Label>
             <Input
              value={
                returnAddr?.same_as_business_address
                  ? seller.company_postal_code
                  : returnAddr.postal_code
              }
              readOnly
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Input } from "@/components/ui/forms/Input";

export default function ShippingInformation() {
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
            <label className="">
              Address line 1
            </label>
            <Input
              value="ewgegweg"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              Address line 2
            </label>
            <Input
              value="ewgegweg"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              City/Town
            </label>
            <Input
              value="ewgegweg"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              State/Region
            </label>
            <Input
              value="ewgegweg"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              Country
            </label>
            <Input
              value="ewgegweg"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              Postal code
            </label>
            <Input
              value="ewgegweg"
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
            <label className="">
              Address line 1
            </label>
            <Input
              value="eqgeqeh"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              Address line 2
            </label>
            <Input
              value="eqgeqeh"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              City/Town
            </label>
            <Input
              value="eqgeqeh"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              State/Region
            </label>
            <Input
              value="eqgeqeh"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              Country
            </label>
            <Input
              value="eqgeqeh"
              readOnly
              className=""
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="">
              Postal code
            </label>
            <Input
              value="eqgeqeh"
              readOnly
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

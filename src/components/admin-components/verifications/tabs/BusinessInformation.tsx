"use client";

import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/Button/Button";

export default function BusinessInformation() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <h3 className="font-MontserratNormal  text-base">
        Company registration
      </h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Row 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="">Business registration number*</label>
          <Input value="32535235234" readOnly className="" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="">CAC registration number*</label>
          <Input value="32535235234" readOnly className="" />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col gap-1.5">
          <label className="">TIN (tax identification number)</label>
          <Input value="465783645721" readOnly className="" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="">Upload TIN (tax identification number)</label>
          <div className="relative">
            <Input
              value="image4733.jpeg"
              readOnly
              className="  border-[#ff715b]/30 "
            />
            <button className="absolute right-1.5 bg-ff715b w-[57px] rounded-c4  top-1/2 -translate-y-1/2 text-c10 text-ffffff h-6 max-w-[57px]">
              View
            </button>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-col gap-1.5">
          <label className="">CAC02 & CAC07</label>
          <div className="relative ">
            <Input
              value="img7464.jpeg"
              readOnly
              className="  border-[#ff715b]  pr-24"
            />
            <button className="absolute right-1.5 bg-ff715b w-[57px] rounded-c4  top-1/2 -translate-y-1/2 text-c10 text-ffffff h-6 max-w-[57px]">
              View
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="">Certificate of registration</label>
          <div className="relative">
            <Input
              value="Certificate.pdf"
              readOnly
              className="  border-[#ff715b]/30 text-gray-500 pr-24"
            />
            <button className="absolute right-1.5 bg-ff715b w-[57px] rounded-c4  top-1/2 -translate-y-1/2 text-c10 text-ffffff h-6 max-w-[57px]">
              View
            </button>
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex flex-col gap-1.5">
          <label className="">VAT number</label>
          <Input value="2938524987524" readOnly className="" />
        </div>
      </div>
    </div>
  );
}

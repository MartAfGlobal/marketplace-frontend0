"use client";

import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";

export default function ShopInformation() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <h3 className="font-MontserratNormal text-base">Business details</h3>
      
      <div className="grid grid-cols-3 gap-x-4 gap-y-6 items-center">
        <div className="flex flex-col gap-1.5">
          <Label className="">Store name</Label>
          <Input 
            value="Shakara Ankara" 
            readOnly 
            className=" cursor-not-allowed" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">Business type</ Label>
          <Input 
            value="Individual" 
            readOnly 
            className="-allowed" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">Registration number</ Label>
          <Input 
            value="CAC745784235" 
            readOnly 
            className="-allowed" 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">Country</ Label>
          <Input 
            value="Nigeria" 
            readOnly 
            className="-allowed" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">State</ Label>
          <Input 
            value="Abia" 
            readOnly 
            className="-allowed" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">Business Industry</ Label>
          <Input 
            value="Technology/Electronics" 
            readOnly 
            className="-allowed" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-[66%]">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">City</Label>
          <Input 
            value="Aba" 
            readOnly 
            className="-allowed" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-MontserratMedium text-[#666666]">Postal code</ Label>
          <Input 
            value="900001" 
            readOnly 
            className="-allowed" 
          />
        </div>
      </div>
    </div>
  );
}

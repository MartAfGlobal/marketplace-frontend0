import { Button } from '@/components/ui/Button/Button';
import { Label } from '@/components/ui/forms/Label';
import React from 'react';

export default function BusinessInformationTab() {
  return (
    <div className="w-full">
      <h3 className="font-MontserratNormal text-base  mb-6">Business details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <Label className="">Store name</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">Shakara Ankara</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Business type</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">Individual</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Registration number</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">CAC745784235</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label className="">Country</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">Nigeria</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">State</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">Abia</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Business Industry</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">Technology/Electronics</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label className="">City</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">Aba</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="">Postal code</Label>
          <div className="h-12 w-full rounded-c8 border border-000000/12 flex items-center px-4 bg-white">
            <span className="font-MontserratMedium text-c12 text-000000/44">900001</span>
          </div>
        </div>
      </div>
      
      <Button className="max-w-56.5">
         View more details
      </Button>
    </div>
  );
}

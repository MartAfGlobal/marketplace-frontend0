"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface SizeGuideDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sizeData = [
  { size: "XS", ageRange: "3 - 4 Yrs", height: "98 - 104", us: "4", uk: "3 - 4" },
  { size: "S", ageRange: "5 - 6 Yrs", height: "110 - 116", us: "6", uk: "5 - 6" },
  { size: "M", ageRange: "7 - 8 Yrs", height: "122 - 128", us: "8", uk: "7 - 8" },
  { size: "L", ageRange: "9 - 10 Yrs", height: "134 - 140", us: "10", uk: "9 - 10" },
  { size: "XL", ageRange: "11 - 12 Yrs", height: "146 - 152", us: "12", uk: "11 - 12" },
  { size: "2XL", ageRange: "13 - 14 Yrs", height: "158 - 164", us: "14", uk: "13 - 14" },
];

export function SizeGuideDrawer({ open, onOpenChange }: SizeGuideDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-screen p-0">
        <DrawerHeader className="border-b p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">
              Size guide
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Subtitle */}
          <div className="text-lg font-medium mb-4">Kid's clothing size chart</div>

          {/* Size Chart Table */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded-t-lg">
              <div className="grid grid-cols-5 gap-2 p-3 text-sm font-medium">
                <div className="text-center">Size</div>
                <div className="text-center">Age Range</div>
                <div className="text-center">Height (cm)</div>
                <div className="text-center">US</div>
                <div className="text-center">UK</div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-b-lg">
              {sizeData.map((item, index) => (
                <div 
                  key={item.size} 
                  className={`grid grid-cols-5 gap-2 p-3 text-sm ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="text-center font-medium">{item.size}</div>
                  <div className="text-center">{item.ageRange}</div>
                  <div className="text-center">{item.height}</div>
                  <div className="text-center">{item.us}</div>
                  <div className="text-center">{item.uk}</div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Take Measurements */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">How to Take Kids' Body Measurements for Clothing</h3>
            <p className="text-sm text-gray-600 mb-4">
              To ensure accurate clothing sizes, measure your child using a soft measuring tape. Make sure they stand straight and wear light or fitted clothing.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Height</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Have your child stand barefoot against a wall, heels touching the base.</li>
                  <li>• Place a flat object (e.g., a book) on top of their head and mark the point on the wall.</li>
                  <li>• Measure from the floor to the mark.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Chest</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Wrap the measuring tape around the fullest part of the chest, just under the arms.</li>
                  <li>• Keep the tape snug but not too tight.</li>
                  <li>• Ensure the child is standing naturally with arms relaxed at their sides.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Waist</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Find the natural waistline, which is the narrowest part of the torso.</li>
                  <li>• Wrap the tape around without squeezing the stomach.</li>
                  <li>• Ensure your child is relaxed and not holding their breath.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Hips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Measure around the widest part of the hips and buttocks.</li>
                  <li>• Keep the measuring tape level and ensure it's not too tight.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Key notes</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">China size format:</span>
              </div>
              <div className="ml-4 space-y-1 text-sm text-gray-600">
                <div><span className="font-medium">A</span> Standard</div>
                <div><span className="font-medium">B</span> Plump</div>
                <div><span className="font-medium">C</span> Chubby</div>
              </div>
            </div>
          </div>

          {/* Measurement Illustrations */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="w-full max-w-sm mx-auto bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="text-gray-500 text-sm">Measurement Guide Illustrations</div>
                  <div className="text-xs text-gray-400 mt-2">
                    Visual guides showing proper measurement techniques for chest, waist, hips, and height
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-3">
            <div className="relative">
              <Button variant="outline" size="sm" className="p-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                </svg>
              </Button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                24
              </span>
            </div>
            <Button variant="outline" className="flex-1">
              Add to cart
            </Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
              Buy now
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 
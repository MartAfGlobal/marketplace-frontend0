import React from "react";

export default function ProductsSkeleton() {
  return (
    <div className="w-full space-y-c32 animate-pulse mt-8">
      {/* ProductInventoryPage Skeleton */}
      <div className="w-full lg:bg-ffffff lg:circle-shadow lg:rounded-c16 lg:py-6 lg:px-8 relative">
        <div className="w-full lg:h-58 flex flex-col lg:flex-row gap-6 lg:gap-39 lg:justify-between">
          
          {/* Left Stats Block */}
          <div className="space-y-6 lg:space-y-c48 flex-1 bg-ffffff py-8 px-6 rounded-c16 lg:rounded-none lg:p-0">
            <div className="flex gap-4 lg:gap-2.5 items-end">
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="flex lg:gap-c64 gap-4">
              <div className="flex gap-2.5 items-end">
                <div className="h-8 w-8 bg-gray-200 rounded hidden lg:block" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-12 lg:w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-8 lg:w-12 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex gap-2.5 items-end">
                <div className="h-8 w-8 bg-gray-200 rounded hidden lg:block" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-12 lg:w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-8 lg:w-12 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex gap-2.5 items-end">
                <div className="h-8 w-8 bg-gray-200 rounded hidden lg:block" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-12 lg:w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-8 lg:w-12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Quick Links Block */}
          <div className="flex-1 lg:py-4 lg:px-4 bg-ffffff p-6 rounded-c16 lg:rounded-none">
            <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
            <div className="flex gap-3 lg:gap-6">
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
            </div>
            <div className="flex gap-3 lg:gap-6 mt-4 lg:mt-6">
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Live Products Table Skeleton */}
        <div className="w-full bg-ffffff mt-6 lg:mt-0 p-6 lg:p-0 lg:pt-c32 rounded-c16 lg:rounded-none">
          <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-gray-200 rounded" />
            <div className="flex gap-4">
               <div className="h-10 w-10 lg:w-24 bg-gray-200 rounded" />
               <div className="h-10 w-10 lg:w-32 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-full bg-gray-50 h-[300px] rounded-lg" />
        </div>
      </div>

      {/* Drafts Product Skeleton */}
      <div className="w-full bg-ffffff lg:circle-shadow lg:rounded-c16 lg:py-6 lg:px-8 p-6 rounded-c16">
        <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-gray-200 rounded" />
            <div className="flex gap-4">
               <div className="h-10 w-10 lg:w-24 bg-gray-200 rounded" />
               <div className="h-10 w-10 lg:w-32 bg-gray-200 rounded" />
            </div>
        </div>
        <div className="w-full bg-gray-50 h-[300px] rounded-lg" />
      </div>
    </div>
  );
}

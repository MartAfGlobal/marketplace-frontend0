import React from "react";

export default function OverviewSkeleton() {
  return (
    <div className="space-y-6 pb-c32 w-full animate-pulse">
      {/* OverviewHeader Skeleton */}
      <div className="flex h-c48 items-center justify-between w-full px-3 relative">
         <div className="flex items-center gap-c48 w-full max-w-[640px]">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="w-full max-w-[348px]">
               <div className="h-10 w-full bg-gray-200 rounded-c8" />
            </div>
         </div>
         <div className="h-10 w-10 bg-gray-200 rounded-c8" />
      </div>

      {/* OverviewCards Skeleton */}
      <div className="grid grid-cols-2 lg:flex w-full gap-4 lg:gap-c32 justify-center">
        {/* Sales Card (full width on mobile) */}
        <div className="col-span-2 lg:col-span-1 lg:flex-1 p-6 h-56 w-full rounded-c16 circle-shadow bg-white flex flex-col justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="flex gap-2.5 items-center mt-4 mb-9">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </div>
          <div className="w-full space-y-4">
            <div className="flex justify-between"><div className="h-2 w-20 bg-gray-200 rounded" /><div className="h-2 w-8 bg-gray-200 rounded" /></div>
            <div className="h-2 w-full bg-gray-200 rounded-c4" />
          </div>
        </div>
        
        {/* Order Card (hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 p-6 h-56 w-full rounded-c16 circle-shadow bg-white flex-col justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="flex gap-2.5 items-center mt-4 mb-9">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
          </div>
          <div className="w-full space-y-4">
            <div className="flex justify-between"><div className="h-2 w-20 bg-gray-200 rounded" /><div className="h-2 w-8 bg-gray-200 rounded" /></div>
            <div className="h-2 w-full bg-gray-200 rounded-c4" />
          </div>
        </div>

        {/* Customer Card */}
        <div className="col-span-1 lg:flex-1 p-6 h-56 w-full rounded-c16 circle-shadow bg-white flex flex-col justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="flex gap-2.5 items-center mt-4 mb-9">
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-full space-y-4">
            <div className="h-2 w-full bg-gray-200 rounded-c4" />
          </div>
        </div>

        {/* Product Stock Card */}
        <div className="col-span-1 lg:flex-1 p-6 h-56 w-full rounded-c16 circle-shadow bg-white flex flex-col justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="flex gap-2.5 items-center mt-4 mb-9">
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-full space-y-4">
            <div className="h-2 w-full bg-gray-200 rounded-c4" />
          </div>
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="w-full h-89 bg-ffffff circle-shadow rounded-c16 p-4 lg:pt-5 lg:pl-11 overflow-hidden">
        <div className="flex gap-6 h-9 mb-6 lg:pr-11">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="w-full h-[250px] bg-gray-100 rounded-c8 mt-4" />
      </div>

      {/* ProductInventory and CategoryRanking Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-c32">
        {/* Product Inventory */}
        <div className="w-full lg:flex-1 order-2 lg:order-1 bg-ffffff h-99.2 circle-shadow rounded-c16 p-4 lg:py-6 lg:px-8 lg:rounded-tr-c64 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <div className="h-6 w-48 bg-gray-200 rounded" />
             <div className="h-10 w-24 bg-gray-200 rounded-c8" />
          </div>
          <div className="flex gap-4 border-b pb-4 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Category Ranking */}
        <div className="w-full lg:flex-1 order-1 lg:order-2 p-4 lg:p-8 bg-ffffff circle-shadow rounded-c16 lg:rounded-tl-c64 overflow-hidden">
           <div className="h-6 w-48 bg-gray-200 rounded mb-8" />
           <div className="space-y-6">
             {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                   <div className="h-12 w-12 bg-gray-200 rounded-c8 shrink-0" />
                   <div className="flex flex-col gap-2 w-full">
                     <div className="h-3 w-3/4 bg-gray-200 rounded" />
                     <div className="h-3 w-1/2 bg-gray-200 rounded" />
                   </div>
                   <div className="h-4 w-12 bg-gray-200 rounded shrink-0" />
                </div>
             ))}
           </div>
        </div>
      </div>

      {/* OverviewOder Skeleton */}
      <div className="hidden lg:block w-full bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-8">
         <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="flex gap-4">
               <div className="h-10 w-64 bg-gray-200 rounded-c8" />
            </div>
         </div>
         <div className="flex gap-4 border-b pb-4 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

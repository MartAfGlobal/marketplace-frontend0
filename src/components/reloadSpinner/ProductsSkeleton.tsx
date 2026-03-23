import React from "react";

export default function ProductsSkeleton() {
  return (
    <div className="w-full space-y-c32 animate-pulse mt-8">
      {/* ProductInventoryPage Skeleton */}
      <div className="w-full bg-ffffff circle-shadow rounded-c16 py-6 px-8 relative">
        <div className="w-full h-58 flex gap-39">
          
          {/* Left Stats Block */}
          <div className="space-y-c48 flex-1">
            <div className="flex gap-2.5 items-end">
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="flex-col gap-3">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="flex gap-c64">
              <div className="flex gap-2.5 items-end">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="flex-col gap-2">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex gap-2.5 items-end">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="flex-col gap-2">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="flex gap-2.5 items-end">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="flex-col gap-2">
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Quick Links Block */}
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
            <div className="flex gap-6">
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
            </div>
            <div className="flex gap-6 mt-6">
              <div className="h-16 w-full rounded-c8 bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Live Products Table Skeleton */}
        <div className="w-full pt-c32">
          <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-gray-200 rounded" />
            <div className="flex gap-4">
               <div className="h-10 w-24 bg-gray-200 rounded" />
               <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-full bg-gray-50 h-[300px] rounded-lg" />
        </div>
      </div>

      {/* Drafts Product Skeleton */}
      <div className="w-full bg-ffffff circle-shadow rounded-c16 py-6 px-8 relative">
        <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-gray-200 rounded" />
            <div className="flex gap-4">
               <div className="h-10 w-24 bg-gray-200 rounded" />
               <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
        </div>
        <div className="w-full bg-gray-50 h-[300px] rounded-lg" />
      </div>
    </div>
  );
}

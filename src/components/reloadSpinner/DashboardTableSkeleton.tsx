import React from "react";

export default function DashboardTableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Page Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-full max-w-[350px] bg-gray-200 rounded-c8" />
      </div>

      <div className="flex gap-8 mt-6 pb-8">
        {/* Sidebar Selector Skeleton */}
        <div className="w-full max-w-[265px]">
          <div className="w-full space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="flex gap-3 items-center w-full h-12 bg-gray-200 rounded px-4" />
            ))}
          </div>
        </div>

        {/* Main Workspace Skeleton */}
        <div className="flex-1">
          <div className="w-full bg-ffffff h-fit circle-shadow rounded-c16 py-6 px-8">
            {/* Header / Actions inside workspace */}
            <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
            <div className="flex justify-between items-center mb-8">
               <div className="h-10 w-10 bg-gray-200 rounded-c8" />
               <div className="flex gap-4">
                 <div className="h-10 w-32 bg-gray-200 rounded-c8" />
                 <div className="h-10 w-32 bg-gray-200 rounded-c8" />
                 <div className="h-10 w-10 bg-gray-200 rounded-c8" />
                 <div className="h-10 w-10 bg-gray-200 rounded-c8" />
               </div>
            </div>

            {/* Table Area */}
            <div className="w-full pt-4">
              <div className="flex gap-4 border-b pb-4 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
              <div className="space-y-6">
                {Array.from({ length: 8 }).map((_, i) => (
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
        </div>
      </div>
    </div>
  );
}

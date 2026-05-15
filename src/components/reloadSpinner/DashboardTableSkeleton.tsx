import React from "react";

export default function DashboardTableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Page Header */}
      <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 md:gap-c48 px-3">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="w-full md:w-auto">
          <div className="h-10 w-full md:w-80 bg-gray-200 rounded-c8" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-6 pb-8">
        {/* Sidebar Selector Skeleton */}
        <div className="w-full lg:max-w-66.25">
          <div className="w-full space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="flex gap-3 items-center w-full h-12 bg-gray-200 rounded px-4" />
            ))}
          </div>
        </div>

        {/* Main Workspace Skeleton */}
        <div className="flex-1 w-full min-w-0">
          <div className="w-full bg-ffffff h-fit circle-shadow rounded-c16 p-6 lg:py-6 lg:px-8">
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

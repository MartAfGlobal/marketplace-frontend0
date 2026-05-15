import React from "react";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export default function OrderDetailsSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Time Left Skeleton (Mobile) */}
      <div className="lg:hidden flex justify-between items-center mb-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Progress Stepper Skeleton */}
      <div className="w-full py-4 px-1">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="space-y-0 overflow-hidden rounded-lg">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-4 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Info Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-0 overflow-hidden rounded-lg">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-4 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Items List Skeleton */}
      <div className="pt-8 border-t border-gray-50 space-y-6">
        <div className="flex gap-8 border-b border-gray-100">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 p-4 border border-gray-50 rounded-xl">
              <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

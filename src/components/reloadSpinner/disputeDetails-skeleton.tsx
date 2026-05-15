const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 ${className}`}
  />
);

export default function DisputeDetailsSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Dispute details section */}
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Alternating row table skeleton */}
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

      {/* Dispute information section */}
      <div className="space-y-6 pt-6 border-t border-gray-50">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="space-y-4 pt-2">
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

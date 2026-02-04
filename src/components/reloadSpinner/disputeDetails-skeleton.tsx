const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 ${className}`}
  />
);

export default function DisputeDetailsSkeleton() {
  return (
    <div className="w-full px-6 md:px-15">
      {/* Back button */}
      <div className="flex items-center gap-4 mt-4 md:mt-c32">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="md:pt-c32 pt-7 md:pb-c64 md:px-62.5">
        <div className="md:p-c32 md:rounded-2xl md:border border-000000/10 space-y-6">
          
          {/* Product section */}
          <div className="flex gap-4 items-start">
            <Skeleton className="h-24 w-24 rounded-lg" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-40 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Return method */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          {/* Evidence images */}
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-24 w-23 rounded-lg"
              />
            ))}
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-40 rounded-lg mt-6" />
        </div>
      </div>
    </div>
  );
}

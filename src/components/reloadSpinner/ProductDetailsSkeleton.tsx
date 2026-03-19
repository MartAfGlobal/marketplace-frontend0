export default function ProductDetailsSkeleton() {
  return (
    <div className="w-full flex justify-center gap-c48 bg-ffffff circle-shadow rounded-c16 py-6 px-8">
      {/* LEFT SIDE */}
      <div className="w-full">
        <div className="flex gap-6 h-76">
          <div className="w-full md:max-w-76 h-76 bg-gray-200 animate-pulse rounded-md" />

          <div className="flex gap-4 flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        </div>

        {/* stats */}
        <div className="flex gap-4 mt-8">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 w-12 bg-gray-200 animate-pulse rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 w-12 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        {/* product name */}
        <div className="mt-6 space-y-2">
          <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-6 w-64 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* description */}
        <div className="mt-6 space-y-3">
          <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-3 w-4/5 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 w-3/5 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full">
        <div className="flex justify-end gap-6">
          <div className="w-40 h-10 bg-gray-200 animate-pulse rounded" />
          <div className="w-40 h-10 bg-gray-200 animate-pulse rounded" />
        </div>

        <div className="mt-c32">
          <div className="h-6 w-28 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* variants */}
        <div className="grid grid-cols-2 gap-y-12 gap-x-16 mt-c48">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="w-24 h-24 bg-gray-200 animate-pulse rounded" />

              <div className="flex flex-col gap-3 w-full">
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
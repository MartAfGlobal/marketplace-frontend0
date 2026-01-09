export default function CartSkeleton() {
  return (
    <div className="px-6 py-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="h-6 w-32 bg-gray-200 rounded" />

      {/* Cart items */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 rounded" />
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="h-20 bg-gray-200 rounded" />
    </div>
  );
}
